import { getD1, isoNow, jsonStringify } from "@/utils/d1/db";
import { getCustomerByUserId } from "@/utils/d1/customers";

export type CreditsView = {
  id: string;
  user_id: string;
  total_credits: number;
  remaining_credits: number;
  created_at: string;
  updated_at: string;
};

export async function getCreditsViewForUser(userId: string): Promise<CreditsView | null> {
  const customer = await getCustomerByUserId(userId);
  if (!customer) return null;

  return {
    id: customer.id,
    user_id: customer.user_id,
    total_credits: customer.credits,
    remaining_credits: customer.credits,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
  };
}

export async function spendUserCredits(input: {
  userId: string;
  amount: number;
  operation: string;
}) {
  const db = getD1();
  const now = isoNow();
  const customer = await getCustomerByUserId(input.userId);
  if (!customer) {
    throw new Error("Customer not found");
  }

  if (customer.credits < input.amount) {
    return { ok: false as const, reason: "INSUFFICIENT_CREDITS" as const };
  }

  const nextCredits = customer.credits - input.amount;
  await db.batch([
    db
      .prepare("UPDATE customers SET credits = ?, updated_at = ? WHERE id = ?")
      .bind(nextCredits, now, customer.id),
    db
      .prepare(
        "INSERT INTO credits_history (id, user_id, amount, type, description, creem_order_id, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        crypto.randomUUID(),
        input.userId,
        -input.amount,
        "spend",
        input.operation,
        null,
        jsonStringify({ source: "api_credits_post" }),
        now
      ),
  ]);

  return { ok: true as const };
}
