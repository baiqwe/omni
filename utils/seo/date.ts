export function toSchemaDateTime(value?: string | null, fallback?: string) {
  const candidate = value?.trim() || fallback?.trim();
  if (!candidate) return undefined;

  const normalized = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(candidate)
    ? candidate.replace(" ", "T")
    : candidate;

  const withTimezone =
    /(?:Z|[+-]\d{2}:\d{2})$/.test(normalized) || !normalized.includes("T")
      ? normalized
      : `${normalized}Z`;

  const parsed = new Date(withTimezone);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
}
