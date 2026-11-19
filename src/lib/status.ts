export type StatusLevel = "good" | "warn" | "bad";

export interface Status {
  label: string;
  level: StatusLevel;
}

interface UsageOptions {
  warnAt?: number;
  badAt?: number;
  labels?: { good: string; warn: string; bad: string };
}

export function usageStatus(
  percentage = 0,
  {
    warnAt = 70,
    badAt = 90,
    labels = { good: "Normal", warn: "High", bad: "Critical" },
  }: UsageOptions = {},
): Status {
  if (percentage >= badAt) return { label: labels.bad, level: "bad" };
  if (percentage >= warnAt) return { label: labels.warn, level: "warn" };
  return { label: labels.good, level: "good" };
}

export function uptimeStatus(seconds = 0): Status {
  const days = seconds / 86400;
  if (days >= 30) return { label: "Long uptime", level: "warn" };
  return { label: "Stable", level: "good" };
}
