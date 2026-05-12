import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getLocalePath } from "@/utils/utils";

type ResetPasswordSearchParams = Message & {
  token?: string;
};

export default async function ResetPasswordPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<ResetPasswordSearchParams>;
}) {
  const params = await props.params;
  const locale = params.locale;
  const searchParams = await props.searchParams;
  const token = typeof searchParams.token === "string" ? searchParams.token : "";

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {locale === "zh" ? "设置新密码" : "Set a new password"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {locale === "zh"
            ? "输入新的密码并确认一次。"
            : "Choose a new password and confirm it once more."}
        </p>
      </div>
      <div className="grid gap-6">
        <form className="grid gap-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="token" value={token} />
          <div className="grid gap-2">
            <Label htmlFor="password">{locale === "zh" ? "新密码" : "New password"}</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">{locale === "zh" ? "确认密码" : "Confirm password"}</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password" required />
          </div>
          <SubmitButton className="w-full" formAction={resetPasswordAction} pendingText={locale === "zh" ? "更新中..." : "Updating..."}>
            {locale === "zh" ? "更新密码" : "Update password"}
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
        <div className="text-sm text-muted-foreground text-center">
          <Link
            href={getLocalePath("/sign-in", locale)}
            className="text-primary underline underline-offset-4 hover:text-primary/90"
          >
            {locale === "zh" ? "返回登录" : "Back to sign in"}
          </Link>
        </div>
      </div>
    </>
  );
}
