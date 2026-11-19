import { Thermometer } from "lucide-react";

interface TempStatCardProps {
  /** overall CPU temperature in °C */
  temperature: number;
  /** per-core temperatures in °C (optional) */
  cores?: number[];
  /** critical temperature in °C (default 100) */
  max?: number;
  title?: string;
  subtitle?: string;
}

type Level = "cool" | "warm" | "hot" | "critical";

const levels: Record<
  Level,
  { label: string; badge: string; icon: string; bar: string; glow: string }
> = {
  cool: {
    label: "Cool",
    badge: "bg-emerald-500/10 text-emerald-500",
    icon: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    bar: "bg-emerald-500",
    glow: "from-emerald-500/10",
  },
  warm: {
    label: "Warm",
    badge: "bg-amber-500/10 text-amber-500",
    icon: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    bar: "bg-amber-500",
    glow: "from-amber-500/10",
  },
  hot: {
    label: "Hot",
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

function getLevel(temp: number, max: number): Level {
  const ratio = temp / max;
  if (ratio < 0.6) return "cool";
  if (ratio < 0.75) return "warm";
  if (ratio < 0.9) return "hot";
  return "critical";
}

const MIN_TEMP = 30;

export default function TempStatCard({
  temperature,
  cores,
  max = 100,
  title = "CPU Temperature",
  subtitle = "Processor",
}: TempStatCardProps) {
  const level = getLevel(temperature, max);
  const style = levels[level];
  const fillPct = Math.min(100, Math.max(0, (temperature / max) * 100));

  const hasCores = cores && cores.length > 0;
  const avg = hasCores ? cores.reduce((a, b) => a + b, 0) / cores.length : 0;
  const peak = hasCores ? Math.max(...cores) : 0;

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
            <Thermometer size={18} />
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">{title}</p>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Main temperature + cores */}
        <div className="flex min-w-0 flex-1 basis-64 items-center gap-4">
          <div className="flex shrink-0 items-baseline gap-0.5">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {Math.round(temperature)}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              °C
            </span>
          </div>

          {hasCores && (
            <>
              <div aria-hidden className="h-8 w-px shrink-0 bg-border/60" />

              {/* Per-core bars */}
              <div className="flex h-8 min-w-0 flex-1 items-end gap-1">
                {cores.map((t, i) => {
                  const h = Math.min(
                    100,
                    Math.max(15, ((t - MIN_TEMP) / (max - MIN_TEMP)) * 100),
                  );
                  return (
                    <div
                      key={i}
                      title={`Core ${i + 1}: ${Math.round(t)}°C`}
                      className="flex h-full max-w-2.5 min-w-1 flex-1 items-end rounded-sm bg-muted/60"
                    >
                      <div
                        className={`w-full rounded-sm transition-all duration-700 ${
                          levels[getLevel(t, max)].bar
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Avg / Max */}
              <div className="shrink-0 text-[11px] leading-tight text-muted-foreground">
                <p>
                  Avg{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {Math.round(avg)}°
                  </span>
                </p>
                <p>
                  Max{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {Math.round(peak)}°
                  </span>
                </p>
              </div>
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

      {/* Temperature vs critical bar */}
      <div className="h-1 w-full bg-muted/60">
        <div
          className={`h-full transition-all duration-700 ${style.bar}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  );
}
