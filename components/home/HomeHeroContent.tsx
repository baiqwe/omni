import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
};

export default async function HomeHeroContent({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <div className="space-y-6 text-center">
      <div className="section-kicker">{t("badge")}</div>
      <h1 className="mx-auto max-w-6xl text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl">
        {t("title")}{" "}
        <span className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
          {t("title_highlight")}
        </span>
      </h1>
      <p className="mx-auto max-w-3xl text-lg leading-8 text-white/68 md:text-xl">
        {t("subtitle")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm text-white/68">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 shadow-sm backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
          {t("feature_1")}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 shadow-sm backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-cyan-300"></span>
          {t("feature_2")}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 shadow-sm backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-fuchsia-300"></span>
          {t("feature_3")}
        </div>
      </div>
    </div>
  );
}
