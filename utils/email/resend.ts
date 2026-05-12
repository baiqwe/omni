type SendPasswordResetEmailInput = {
  to: string;
  resetUrl: string;
  locale: "en" | "zh";
};

export async function sendPasswordResetEmail(input: SendPasswordResetEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.AUTH_EMAIL_FROM?.trim() || "Gemini Omni <no-reply@geminiomni.xyz>";

  if (!apiKey) {
    console.warn("RESEND_API_KEY is not configured. Password reset email was not sent.", {
      to: input.to,
      resetUrl: input.resetUrl,
    });
    return { ok: false as const, skipped: true as const };
  }

  const subject =
    input.locale === "zh" ? "重置你的 Gemini Omni 密码" : "Reset your Gemini Omni password";
  const intro =
    input.locale === "zh"
      ? "点击下面的链接重置你的密码。链接将在 30 分钟后失效。"
      : "Use the link below to reset your password. The link expires in 30 minutes.";
  const fallback =
    input.locale === "zh"
      ? "如果你没有请求重置密码，可以忽略这封邮件。"
      : "If you did not request a password reset, you can ignore this email.";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2>${subject}</h2>
          <p>${intro}</p>
          <p><a href="${input.resetUrl}" style="display:inline-block;padding:12px 18px;background:#2563ff;color:white;text-decoration:none;border-radius:10px;">${
            input.locale === "zh" ? "重置密码" : "Reset password"
          }</a></p>
          <p style="word-break:break-all">${input.resetUrl}</p>
          <p>${fallback}</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Failed to send password reset email: ${message}`);
  }

  return { ok: true as const, skipped: false as const };
}
