import { getD1, isoNow } from "@/utils/d1/db";

export type PasswordResetTokenRecord = {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used_at: string | null;
};

export async function createPasswordResetToken(userId: string, expiresAt: Date) {
  const db = getD1();
  const id = crypto.randomUUID();
  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");

  await db
    .prepare(
      "INSERT INTO password_reset_tokens (id, user_id, token, expires_at, created_at, used_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(id, userId, token, expiresAt.toISOString(), isoNow(), null)
    .run();

  return token;
}

export async function getValidPasswordResetToken(token: string) {
  const db = getD1();
  const record = await db
    .prepare(
      "SELECT id, user_id, token, expires_at, used_at FROM password_reset_tokens WHERE token = ?"
    )
    .bind(token)
    .first<PasswordResetTokenRecord | null>();

  if (!record || record.used_at) {
    return null;
  }

  if (new Date(record.expires_at).getTime() <= Date.now()) {
    return null;
  }

  return record;
}

export async function markPasswordResetTokenUsed(tokenId: string) {
  const db = getD1();
  await db
    .prepare("UPDATE password_reset_tokens SET used_at = ? WHERE id = ?")
    .bind(isoNow(), tokenId)
    .run();
}
