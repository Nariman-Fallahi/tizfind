import { ArrowDown, ArrowUp, Globe } from "lucide-react";

interface NetworkStatCardProps {
  /** bytes per second */
  downloadSpeed: number;
  /** bytes per second */
  uploadSpeed: number;
  /** total bytes */
  totalDownload: number;
  /** total bytes */
  totalUpload: number;
}

const UNITS = ["B", "KB", "MB", "GB", "TB"];

function formatBytes(bytes: number) {
  let value = Math.max(0, bytes);
  let i = 0;
  while (value >= 1024 && i < UNITS.length - 1) {
    value /= 1024;
    i++;
  }
  const decimals = i === 0 ? 0 : value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return { value: value.toFixed(decimals), unit: UNITS[i] };
}

function Stat({
  label,
  icon: Icon,
  speed,
  total,
  iconClass,
}: {
  label: string;
  icon: typeof ArrowDown;
  speed: number;
  total: number;
  iconClass: string;
}) {
  const s = formatBytes(speed);
  const t = formatBytes(total);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ${iconClass}`}
      >
        <Icon size={16} strokeWidth={2.5} />
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline gap-1">
          <span className="truncate text-xl font-semibold tracking-tight tabular-nums">
            {s.value}
          </span>
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
            {s.unit}/s
          </span>
        </div>
        <p className="truncate text-[11px] text-muted-foreground">
          {label} ·{" "}
          <span className="tabular-nums">
            {t.value} {t.unit}
          </span>
        </p>
      </div>
    </div>
  );
}

export default function NetworkStatCard({
  downloadSpeed,
  uploadSpeed,
  totalDownload,
  totalUpload,
}: NetworkStatCardProps) {
  const sum = totalDownload + totalUpload;
  const downPct = sum > 0 ? (totalDownload / sum) * 100 : 50;

  return (
    <div className="group relative isolate w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Soft top highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-linear-to-b from-sky-500/10 to-transparent"
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3">
        {/* Title */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 ring-1 ring-sky-500/20 transition-transform duration-300 group-hover:scale-105">
            <Globe size={18} />
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">Network</p>
            <p className="text-[11px] text-muted-foreground">Internet usage</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex min-w-0 flex-1 basis-64 items-center gap-4">
          <Stat
            label="Download"
            icon={ArrowDown}
            speed={downloadSpeed}
            total={totalDownload}
            iconClass="bg-blue-500/10 text-blue-500 ring-blue-500/20"
          />
          <div aria-hidden className="h-8 w-px shrink-0 bg-border/60" />
          <Stat
            label="Upload"
            icon={ArrowUp}
            speed={uploadSpeed}
            total={totalUpload}
            iconClass="bg-violet-500/10 text-violet-500 ring-violet-500/20"
          />
        </div>

        {/* Live badge */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-500">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </div>
      </div>

      {/* Download / upload ratio bar */}
      <div className="flex h-1 w-full bg-violet-500/30">
        <div
          className="h-full bg-blue-500 transition-[width] duration-700"
          style={{ width: `${downPct}%` }}
        />
      </div>
    </div>
  );
}
