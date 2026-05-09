export function parseDurationLabelToSeconds(label: string): number | null {
  const normalized = label.trim().toLowerCase();
  const match = normalized.match(/^(\d+)\s*s$/);
  if (!match) return null;

  const seconds = Number.parseInt(match[1], 10);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

export function secondsToIsoDuration(seconds: number): string {
  return `PT${Math.max(1, Math.floor(seconds))}S`;
}
