import { redirect } from "next/navigation";

export default async function FallbackLocalizedPage(props: {
  params: Promise<{ path: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const targetPath = `/${["en", ...(params.path || [])].join("/")}`;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (value != null) {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  redirect(queryString ? `${targetPath}?${queryString}` : targetPath);
}
