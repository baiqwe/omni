import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function LocaleNotFound() {
  const locale = await getLocale();
  const isZh = locale === "zh";

  return (
    <div className="container flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-black/24 p-8 text-center shadow-[0_26px_80px_-46px_rgba(0,0,0,0.82)] backdrop-blur-sm">
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/76">
          {isZh ? "页面未找到" : "Page not found"}
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {isZh ? "这个链接已经失效，先回到 Gemini Omni 主路径。" : "This URL is no longer active. Return to the main Gemini Omni flow."}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/66">
          {isZh
            ? "你可以回到首页，或继续查看关于、隐私和条款页面。"
            : "You can return to the homepage, or continue with the About, Privacy, and Terms pages."}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#2563ff,#6d28d9)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-18px_rgba(59,130,246,0.65)]"
          >
            {isZh ? "返回首页" : "Back to home"}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/84 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            {isZh ? "查看关于" : "About"}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/74 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            {isZh ? "查看隐私" : "Privacy"}
          </Link>
        </div>
      </div>
    </div>
  );
}
