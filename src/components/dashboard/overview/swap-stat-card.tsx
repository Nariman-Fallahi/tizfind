import { ReactNode } from "react";
import { ArrowLeftRight } from "lucide-react";

interface SwapStatCardProps {
  /** swap used, in bytes */
  used: number;
  /** swap total, in bytes (0 = no swap configured) */
  total: number;
  title?: string;
  subtitle?: string;
}

const UNITS = ["B", "KB", "MB", "GB", "TB"];

function formatBytes(bytes: number) {
  let value = Math.max(0, bytes);
  let i = 0;
  while (value >= 1024 && i < UNITS.length - 1) {
    value /= 1024;
    i++;
  }
  const decimals = i <= 1 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(decimals)} ${UNITS[i]}`;
}

type Level = "none" | "healthy" | "moderate" | "high" | "critical";

const levels: Record<
  Level,
  {
    label: string;
    badge: string;
    icon: string;
    bar: string;
    glow: string;
  }
> = {
  none: {
    label: "No swap",
    badge: "bg-muted text-muted-foreground",
    icon: "bg-muted text-muted-foreground ring-border/60",
    bar: "bg-muted-foreground/40",
    glow: "from-muted-foreground/5",
  },
  healthy: {
    label: "Healthy",
    badge: "bg-emerald-500/10 text-emerald-500",
    icon: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    bar: "bg-emerald-500",
    glow: "from-emerald-500/10",
  },
  moderate: {
    label: "Moderate",
    badge: "bg-amber-500/10 text-amber-500",
    icon: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    bar: "bg-amber-500",
    glow: "from-amber-500/10",
  },
  high: {
    label: "High",
    badge: "bg-orange-500/10 text-orange-500",
    icon: "bg-orange-500/10 text-orange-500 ring-orange-500/20",
    bar: "bg-orange-500",
    glow: "from-orange-500/10",
  },
  critical: {
    label: "Critical",
    badge: "bg-red-500/10 text-red-500",
    icon: "bg-red-500/10 text-red-500 ring-red-500/20",
    bar: "bg-red-500",
    glow: "from-red-500/10",
  },
};

function getLevel(pct: number, hasSwap: boolean): Level {
  if (!hasSwap) return "none";
  if (pct < 20) return "healthy";
  if (pct < 50) return "moderate";
  if (pct < 80) return "high";
  return "critical";
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 shrink-0">
      <p className="text-[11px] leading-tight text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold leading-tight tabular-nums">
        {children}
      </p>
    </div>
  );
}

function Divider() {
  return <div aria-hidden className="h-8 w-px shrink-0 bg-border/60" />;
}

export default function SwapStatCard({
  used,
  total,
  title = "Swap",
  subtitle = "Virtual memory",
}: SwapStatCardProps) {
  const hasSwap = total > 0;
  const pct = hasSwap ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;
  const style = levels[getLevel(pct, hasSwap)];
  const free = Math.max(0, total - used);

  return (
    <div className="group relative isolate w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Soft highlight (follows status color) */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-linear-to-b to-transparent transition-colors duration-500 ${style.glow}`}
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
        {/* Title */}
        <div className="flex shrink-0 items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-105 ${style.icon}`}
          >
            <ArrowLeftRight size={18} />
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">{title}</p>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Usage + stats */}
        <div className="flex min-w-0 flex-1 basis-64 flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex shrink-0 items-baseline gap-0.5">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {hasSwap ? Math.round(pct) : "–"}
            </span>
            {hasSwap && (
              <span className="text-xs font-medium text-muted-foreground">
                %
              </span>
            )}
          </div>

          {hasSwap && (
            <>
              <Divider />
              <Stat label="Used">{formatBytes(used)}</Stat>
              <Divider />
              <Stat label="Free">{formatBytes(free)}</Stat>
              <Divider />
              <Stat label="Total">{formatBytes(total)}</Stat>
            </>
          )}
        </div>

        {/* Status badge */}
        <div
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${style.badge}`}
        >
          {style.label}
        </div>
      </div>

      {/* Usage bar */}
      <div className="h-1 w-full bg-muted/60">
        <div
          className={`h-full transition-all duration-700 ${style.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
