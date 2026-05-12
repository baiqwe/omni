import { getD1, isoNow, jsonStringify, safeJsonParse } from "@/utils/d1/db";
import type { D1Customer } from "@/utils/d1/types";

export async function getCustomerByUserId(userId: string) {
  const result = await getD1()
    .prepare("SELECT * FROM customers WHERE user_id = ? LIMIT 1")
    .bind(userId)
    .first<D1Customer | null>();

  return result ?? null;
}

export async function provisionCustomerIfMissing(input: {
  userId: string;
  email?: string | null;
  name?: string | null;
  initialCredits?: number;
}) {
  const existing = await getCustomerByUserId(input.userId);
  if (existing) return existing;

  const now = isoNow();
  const customer: D1Customer = {
    id: crypto.randomUUID(),
    user_id: input.userId,
    email: input.email ?? null,
    name: input.name ?? null,
    credits: input.initialCredits ?? 3,
    plan_type: null,
    subscription_status: null,
    creem_customer_id: null,
    country: null,
    metadata_json: jsonStringify({
      source: "authjs_d1_provisioning",
      initial_credits: input.initialCredits ?? 3,
    }),
    created_at: now,
    updated_at: now,
  };

  await getD1()
    .prepare(
      `
      INSERT INTO customers (
        id, user_id, email, name, credits, plan_type, subscription_status,
        creem_customer_id, country, metadata_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .bind(
      customer.id,
      customer.user_id,
      customer.email,
      customer.name,
      customer.credits,
      customer.plan_type,
      customer.subscription_status,
      customer.creem_customer_id,
      customer.country,
      customer.metadata_json,
      customer.created_at,
      customer.updated_at
    )
    .run();

  await getD1()
    .prepare(
      `
      INSERT INTO credits_history (
        id, user_id, amount, type, description, creem_order_id, metadata_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .bind(
      crypto.randomUUID(),
      customer.user_id,
      customer.credits,
      "add",
      "Welcome bonus for Seedance 2 account provisioning",
      null,
      jsonStringify({ source: "authjs_d1_provisioning" }),
      now
    )
    .run();

  return customer;
}

export function parseCustomerMetadata(customer: Pick<D1Customer, "metadata_json">) {
  return safeJsonParse<Record<string, unknown>>(customer.metadata_json, {});
}
