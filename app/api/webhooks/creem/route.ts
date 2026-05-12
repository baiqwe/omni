import { headers } from "next/headers";
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { verifyCreemWebhookSignature } from "@/utils/creem/verify-signature";
import { CreemCheckout, CreemSubscription, CreemWebhookEvent } from "@/types/creem";
import {
  createOrUpdateCustomer,
  createOrUpdateSubscription,
  addCreditsToCustomer,
} from "@/utils/supabase/subscriptions";
import { isCloudflareDataBackend } from "@/utils/backend/runtime";
import {
  addCreditsToCustomerByUserId,
  createOrUpdateCustomerFromCreem,
  createOrUpdateSubscriptionFromCreem,
  getCustomerByCreemCustomerId,
} from "@/utils/d1/subscriptions";
import { getD1, isoNow } from "@/utils/d1/db";

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const headersList = headers();
    const signature = (await headersList).get("creem-signature") || "";

    // Verify the webhook signature
    if (
      !signature ||
      !(await verifyCreemWebhookSignature(body, signature, CREEM_WEBHOOK_SECRET))
    ) {
      console.error("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body) as CreemWebhookEvent;
    console.log("Received webhook event:", event.eventType, event.object?.id);

    if (isCloudflareDataBackend()) {
      const duplicate = await isProcessedWebhookEvent(event.id);
      if (duplicate) {
        return NextResponse.json({ received: true, duplicate: true });
      }
      await upsertWebhookEventLog(event.id, body, false);
    }

    // Handle different event types
    switch (event.eventType) {
      case "checkout.completed":
        await handleCheckoutCompleted(event);
        break;
      case "subscription.active":
        await handleSubscriptionActive(event);
        break;
      case "subscription.paid":
        await handleSubscriptionPaid(event);
        break;
      case "subscription.canceled":
        await handleSubscriptionCanceled(event);
        break;
      case "subscription.expired":
        await handleSubscriptionExpired(event);
        break;
      case "subscription.trialing":
        await handleSubscriptionTrialing(event);
        break;
      default:
        console.log(
          `Unhandled event type: ${event.eventType} ${JSON.stringify(event)}`
        );
    }

    if (isCloudflareDataBackend()) {
      await upsertWebhookEventLog(event.id, body, true);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Webhook processing failed", details: errorMessage },
      { status: 500 }
    );
  }
}

function getMetadataUserId(record: Record<string, any> | null | undefined) {
  const direct = record?.metadata?.user_id;
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  const orderUser = record?.order?.metadata?.user_id;
  if (typeof orderUser === "string" && orderUser.trim()) {
    return orderUser.trim();
  }

  return null;
}

function getOrderCredits(checkout: CreemCheckout) {
  const raw =
    checkout.metadata?.credits ??
    checkout.order?.metadata?.credits ??
    0;

  const parsed = typeof raw === "string" ? Number.parseInt(raw, 10) : Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return parsed;
}

function getCreemCustomerId(customer: unknown) {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  if (typeof customer === "object" && customer !== null && "id" in customer) {
    const id = (customer as { id?: unknown }).id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return null;
}

async function resolveUserIdForSubscription(subscription: CreemSubscription) {
  const metadataUserId = getMetadataUserId(subscription as unknown as Record<string, any>);
  if (metadataUserId) return metadataUserId;

  const creemCustomerId = getCreemCustomerId(subscription.customer);
  if (!creemCustomerId) return null;

  const customer = await getCustomerByCreemCustomerId(creemCustomerId);
  return customer?.user_id ?? null;
}

async function isProcessedWebhookEvent(externalEventId: string) {
  if (!externalEventId) return false;

  const existing = await getD1()
    .prepare(
      "SELECT id FROM webhook_events WHERE provider = ? AND external_event_id = ? AND processed_at IS NOT NULL LIMIT 1"
    )
    .bind("creem", externalEventId)
    .first<{ id: string } | null>();

  return Boolean(existing?.id);
}

async function upsertWebhookEventLog(externalEventId: string, payload: string, processed: boolean) {
  if (!externalEventId) return;

  const now = isoNow();
  const db = getD1();
  const existing = await db
    .prepare("SELECT id FROM webhook_events WHERE provider = ? AND external_event_id = ? LIMIT 1")
    .bind("creem", externalEventId)
    .first<{ id: string } | null>();

  if (existing?.id) {
    await db
      .prepare(
        "UPDATE webhook_events SET payload_json = ?, processed_at = ?, created_at = COALESCE(created_at, ?) WHERE id = ?"
      )
      .bind(payload, processed ? now : null, now, existing.id)
      .run();
    return;
  }

  await db
    .prepare(
      "INSERT INTO webhook_events (id, provider, external_event_id, payload_json, processed_at, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(crypto.randomUUID(), "creem", externalEventId, payload, processed ? now : null, now)
    .run();
}

async function handleCheckoutCompleted(event: CreemWebhookEvent) {
  const checkout = event.object;
  console.log("Processing completed checkout:", checkout);

  if (isCloudflareDataBackend()) {
    const checkoutObject = checkout as CreemCheckout;
    const userId = getMetadataUserId(checkoutObject as unknown as Record<string, any>);
    const fallbackEmail =
      typeof checkoutObject?.customer === "object" ? checkoutObject.customer?.email : null;

    const resolvedUserId = await createOrUpdateCustomerFromCreem({
      creemCustomer: checkoutObject.customer,
      userId,
      fallbackEmail,
    });

    if (checkoutObject.subscription) {
      await createOrUpdateSubscriptionFromCreem({
        subscription: checkoutObject.subscription,
        userId: resolvedUserId,
      });
    }

    const credits = getOrderCredits(checkoutObject);
    if (credits > 0) {
      await addCreditsToCustomerByUserId({
        userId: resolvedUserId,
        credits,
        creemOrderId: checkoutObject.order?.id,
        description: `Purchased ${credits} credits (${checkoutObject.metadata?.product_type || "unknown"})`,
        metadata: {
          source: "creem_webhook",
          eventType: event.eventType,
        },
      });
    }

    return;
  }

  try {
    // Validate required data
    if (!checkout.metadata?.user_id) {
      console.error("Missing user_id in checkout metadata:", checkout);
      throw new Error("user_id is required in checkout metadata");
    }

    // Create or update customer
    const customerId = await createOrUpdateCustomer(
      checkout.customer,
      checkout.metadata.user_id
    );

    // If subscription exists, create or update it
    if (checkout.subscription) {
      await createOrUpdateSubscription(checkout.subscription, customerId);
    }

    // Add credits if credits are specified in metadata (for both credits and subscription purchases)
    if (checkout.metadata?.credits) {
      const credits = typeof checkout.metadata.credits === 'string'
        ? parseInt(checkout.metadata.credits)
        : checkout.metadata.credits;

      await addCreditsToCustomer(
        customerId,
        credits,
        checkout.order.id,
        `Purchased ${credits} credits (${checkout.metadata?.product_type || 'unknown'})`
      );
      console.log(`Added ${credits} credits to customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error handling checkout completed:", error);
    throw error;
  }
}


async function handleSubscriptionActive(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing active subscription:", subscription);

  if (isCloudflareDataBackend()) {
    const subscriptionObject = subscription as CreemSubscription;
    const userId = await resolveUserIdForSubscription(subscriptionObject);
    if (!userId) {
      throw new Error("Missing user mapping for subscription.active event");
    }

    await createOrUpdateCustomerFromCreem({
      creemCustomer: subscriptionObject.customer,
      userId,
    });
    await createOrUpdateSubscriptionFromCreem({
      subscription: subscriptionObject,
      userId,
    });
    return;
  }

  try {
    // Create or update customer
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );

    // Create or update subscription
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription active:", error);
    throw error;
  }
}

async function handleSubscriptionPaid(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing paid subscription:", subscription);

  if (isCloudflareDataBackend()) {
    const subscriptionObject = subscription as CreemSubscription;
    const userId = await resolveUserIdForSubscription(subscriptionObject);
    if (!userId) {
      throw new Error("Missing user mapping for subscription.paid event");
    }

    await createOrUpdateCustomerFromCreem({
      creemCustomer: subscriptionObject.customer,
      userId,
    });
    await createOrUpdateSubscriptionFromCreem({
      subscription: subscriptionObject,
      userId,
    });
    return;
  }

  try {
    // Update subscription status and period
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription paid:", error);
    throw error;
  }
}

async function handleSubscriptionCanceled(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing canceled subscription:", subscription);

  if (isCloudflareDataBackend()) {
    const subscriptionObject = subscription as CreemSubscription;
    const userId = await resolveUserIdForSubscription(subscriptionObject);
    if (!userId) {
      throw new Error("Missing user mapping for subscription.canceled event");
    }

    await createOrUpdateCustomerFromCreem({
      creemCustomer: subscriptionObject.customer,
      userId,
    });
    await createOrUpdateSubscriptionFromCreem({
      subscription: subscriptionObject,
      userId,
    });
    return;
  }

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription canceled:", error);
    throw error;
  }
}

async function handleSubscriptionExpired(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing expired subscription:", subscription);

  if (isCloudflareDataBackend()) {
    const subscriptionObject = subscription as CreemSubscription;
    const userId = await resolveUserIdForSubscription(subscriptionObject);
    if (!userId) {
      throw new Error("Missing user mapping for subscription.expired event");
    }

    await createOrUpdateCustomerFromCreem({
      creemCustomer: subscriptionObject.customer,
      userId,
    });
    await createOrUpdateSubscriptionFromCreem({
      subscription: subscriptionObject,
      userId,
    });
    return;
  }

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription expired:", error);
    throw error;
  }
}

async function handleSubscriptionTrialing(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing trialing subscription:", subscription);

  if (isCloudflareDataBackend()) {
    const subscriptionObject = subscription as CreemSubscription;
    const userId = await resolveUserIdForSubscription(subscriptionObject);
    if (!userId) {
      throw new Error("Missing user mapping for subscription.trialing event");
    }

    await createOrUpdateCustomerFromCreem({
      creemCustomer: subscriptionObject.customer,
      userId,
    });
    await createOrUpdateSubscriptionFromCreem({
      subscription: subscriptionObject,
      userId,
    });
    return;
  }

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription trialing:", error);
    throw error;
  }
}
