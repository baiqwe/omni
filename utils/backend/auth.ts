import { auth } from "@/auth";

export type AuthenticatedUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export async function requireSessionUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  };
}
