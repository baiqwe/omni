import { CreemCustomer, CreemSubscription } from "@/types/creem";
import { getD1, isoNow, jsonStringify, safeJsonParse } from "@/utils/d1/db";
import { getCustomerByUserId } from "@/utils/d1/customers";

type CustomerUpsertInput = {
  creemCustomer: CreemCustomer | string | null | undefined;
  userId?: string | null;
  fallbackEmail?: string | null;
};

function normalizeSubscriptionProductId(subscription: CreemSubscription) {
  if (typeof subscription.product === "string") return subscription.product;
  return subscription.product?.id ?? null;
}

function extractCreemCustomerId(customer: CreemCustomer | string | null | undefined) {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  return customer.id ?? null;
}

function extractCreemCustomerProfile(customer: CreemCustomer | string | null | undefined) {
  if (!customer || typeof customer === "string") {
    return { email: null, name: null, country: null };
  }

  return {
    email: customer.email ?? null,
    name: customer.name ?? null,
    country: customer.country ?? null,
  };
}

export async function getLatestSubscriptionByUserId(userId: string) {
  return getD1()
    .prepare(
      "SELECT status, current_period_end, creem_product_id FROM subscriptions WHERE user_id = ? ORDER BY current_period_end DESC LIMIT 1"
    )
    .bind(userId)
    .first<{ status: string; current_period_end: string; creem_product_id?: string | null } | null>();
}

export async function getCustomerByCreemCustomerId(creemCustomerId: string) {
  return getD1()
    .prepare("SELECT * FROM customers WHERE creem_customer_id = ? LIMIT 1")
    .bind(creemCustomerId)
    .first<{
      id: string;
      user_id: string;
      email: string | null;
      name: string | null;
      country: string | null;
      creem_customer_id: string | null;
      metadata_json: string | null;
    } | null>();
}

export async function createOrUpdateCustomerFromCreem(input: CustomerUpsertInput) {
  const creemCustomerId = extractCreemCustomerId(input.creemCustomer);
  const profile = extractCreemCustomerProfile(input.creemCustomer);

  const now = isoNow();
  const userId = input.userId?.trim() || null;
  const db = getD1();

  let existing:
    | {
        id: string;
        user_id: string;
        email: string | null;
        name: string | null;
        country: string | null;
        creem_customer_id: string | null;
        metadata_json: string | null;
      }
    | null = null;

  if (userId) {
    existing = await getCustomerByUserId(userId);
  }

  if (!existing && creemCustomerId) {
    existing = await getCustomerByCreemCustomerId(creemCustomerId);
  }

  if (existing) {
    const currentMetadata = safeJsonParse<Record<string, unknown>>(existing.metadata_json, {});
    await db
      .prepare(
        `
        UPDATE customers
        SET creem_customer_id = COALESCE(?, creem_customer_id),
            email = COALESCE(email, ?),
            name = COALESCE(name, ?),
            country = COALESCE(?, country),
            metadata_json = ?,
            updated_at = ?
        WHERE id = ?
        `
      )
      .bind(
        creemCustomerId,
        profile.email ?? input.fallbackEmail ?? null,
        profile.name,
        profile.country,
        jsonStringify({
          ...currentMetadata,
          billing_source: "creem_webhook",
          last_creem_sync_at: now,
        }),
        now,
        existing.id
      )
      .run();

    return existing.user_id;
  }

  if (!userId) {
    throw new Error("USER_ID_REQUIRED_FOR_CUSTOMER_CREATE");
  }

  const newCustomerId = crypto.randomUUID();
  await db
    .prepare(
      `
      INSERT INTO customers (
        id, user_id, email, name, credits, plan_type, subscription_status,
        creem_customer_id, country, metadata_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .bind(
      newCustomerId,
      userId,
      profile.email ?? input.fallbackEmail ?? null,
      profile.name,
      0,
      null,
      null,
      creemCustomerId,
      profile.country,
      jsonStringify({
        billing_source: "creem_webhook",
        created_by: "createOrUpdateCustomerFromCreem",
      }),
      now,
      now
    )
    .run();

  return userId;
}

export async function createOrUpdateSubscriptionFromCreem(input: {
  subscription: CreemSubscription;
  userId: string;
}) {
  const now = isoNow();
  const db = getD1();
  const productId = normalizeSubscriptionProductId(input.subscription);

  const existing = await db
    .prepare("SELECT id FROM subscriptions WHERE creem_subscription_id = ? LIMIT 1")
    .bind(input.subscription.id)
    .first<{ id: string } | null>();

  const payload = {
    userId: input.userId,
    creemProductId: productId,
    status: input.subscription.status,
    currentPeriodStart: input.subscription.current_period_start_date ?? null,
    currentPeriodEnd: input.subscription.current_period_end_date ?? null,
    canceledAt: input.subscription.canceled_at ?? null,
    metadataJson: jsonStringify(input.subscription.metadata ?? {}),
  };

  if (existing?.id) {
    await db
      .prepare(
        `
        UPDATE subscriptions
        SET user_id = ?,
            creem_product_id = ?,
            status = ?,
            current_period_start = ?,
            current_period_end = ?,
            canceled_at = ?,
            metadata_json = ?,
            updated_at = ?
        WHERE id = ?
        `
      )
      .bind(
        payload.userId,
        payload.creemProductId,
        payload.status,
        payload.currentPeriodStart,
        payload.currentPeriodEnd,
        payload.canceledAt,
        payload.metadataJson,
        now,
        existing.id
      )
      .run();

    return existing.id;
  }

  const id = crypto.randomUUID();
  await db
    .prepare(
      `
      INSERT INTO subscriptions (
        id, user_id, creem_subscription_id, creem_product_id, status,
        current_period_start, current_period_end, canceled_at, metadata_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .bind(
      id,
      payload.userId,
      input.subscription.id,
      payload.creemProductId,
      payload.status,
      payload.currentPeriodStart,
      payload.currentPeriodEnd,
      payload.canceledAt,
      payload.metadataJson,
      now,
      now
    )
    .run();

  return id;
}

export async function addCreditsToCustomerByUserId(input: {
  userId: string;
  credits: number;
  creemOrderId?: string | null;
  description?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!Number.isFinite(input.credits) || input.credits <= 0) {
    throw new Error("INVALID_CREDIT_AMOUNT");
  }

  const db = getD1();
  const now = isoNow();
  const customer = await getCustomerByUserId(input.userId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  if (input.creemOrderId) {
    const existing = await db
      .prepare(
        "SELECT id FROM credits_history WHERE user_id = ? AND creem_order_id = ? AND type = 'add' LIMIT 1"
      )
      .bind(input.userId, input.creemOrderId)
      .first<{ id: string } | null>();

    if (existing?.id) {
      return {
        skipped: true as const,
        reason: "ORDER_ALREADY_APPLIED" as const,
        balance: customer.credits,
      };
    }
  }

  const nextCredits = customer.credits + input.credits;

  await db.batch([
    db
      .prepare("UPDATE customers SET credits = ?, updated_at = ? WHERE id = ?")
      .bind(nextCredits, now, customer.id),
    db
      .prepare(
        `
        INSERT INTO credits_history (id, user_id, amount, type, description, creem_order_id, metadata_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
      )
      .bind(
        crypto.randomUUID(),
        input.userId,
        input.credits,
        "add",
        input.description ?? "Credits purchase",
        input.creemOrderId ?? null,
        jsonStringify(input.metadata ?? { source: "creem_webhook" }),
        now
      ),
  ]);

  return { skipped: false as const, balance: nextCredits };
}
