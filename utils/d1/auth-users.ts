import bcrypt from "bcryptjs";
import { getD1, isoNow } from "@/utils/d1/db";

export type D1AuthUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  password_hash: string | null;
  emailVerified: string | null;
};

const DEFAULT_PASSWORD_ROUNDS = 10;

export async function getAuthUserByEmail(email: string) {
  const db = getD1();
  return db
    .prepare("SELECT id, email, name, image, password_hash, emailVerified FROM users WHERE email = ?")
    .bind(email.toLowerCase().trim())
    .first<D1AuthUser | null>();
}

export async function getAuthUserById(userId: string) {
  const db = getD1();
  return db
    .prepare("SELECT id, email, name, image, password_hash, emailVerified FROM users WHERE id = ?")
    .bind(userId)
    .first<D1AuthUser | null>();
}

export async function createCredentialsUser(input: {
  email: string;
  password: string;
  name?: string | null;
}) {
  const db = getD1();
  const email = input.email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(input.password, DEFAULT_PASSWORD_ROUNDS);
  const userId = crypto.randomUUID();
  const now = isoNow();

  await db.batch([
    db
      .prepare(
        "INSERT INTO users (id, name, email, emailVerified, image, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(userId, input.name?.trim() || null, email, null, null, passwordHash, now, now),
  ]);

  return getAuthUserById(userId);
}

export async function verifyCredentialsPassword(email: string, password: string) {
  const user = await getAuthUserByEmail(email);
  if (!user?.password_hash) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    return null;
  }

  return user;
}

export async function updateUserPassword(userId: string, password: string) {
  const db = getD1();
  const passwordHash = await bcrypt.hash(password, DEFAULT_PASSWORD_ROUNDS);

  await db
    .prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?")
    .bind(passwordHash, isoNow(), userId)
    .run();
}
