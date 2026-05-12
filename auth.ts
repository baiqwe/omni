import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { D1Adapter } from "@auth/d1-adapter";
import { z } from "zod";
import { getOptionalCloudflareEnv } from "@/utils/cloudflare/context";
import { verifyCredentialsPassword } from "@/utils/d1/auth-users";
import { provisionCustomerIfMissing } from "@/utils/d1/customers";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const env = getOptionalCloudflareEnv();
const hasD1 = Boolean(env?.DB);
const hasGoogle = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: hasD1 ? D1Adapter(env!.DB) : undefined,
  session: {
    strategy: hasD1 ? "database" : "jwt",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    ...(hasGoogle
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        if (!hasD1) {
          return null;
        }

        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        const user = await verifyCredentialsPassword(parsed.data.email, parsed.data.password);
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ user }) {
      if (hasD1 && user?.id && user.email) {
        await provisionCustomerIfMissing({
          userId: user.id,
          email: user.email,
          name: user.name,
        });
      }
      return true;
    },
  },
});
