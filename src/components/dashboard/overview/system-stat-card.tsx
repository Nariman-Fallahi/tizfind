import { Status } from "@/lib/status";
import { AlertTriangle, CheckCircle2, LucideIcon, XCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

interface SystemStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  percentage?: number;
  icon: LucideIcon;
  color: "blue" | "violet" | "emerald" | "orange";
  status?: Status;
}

const colors = {
  blue: {
    icon: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
    fill: "rgb(59 130 246)",
    border: "group-hover:border-blue-500/30",
    glow: "from-blue-500/10",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-500 ring-violet-500/20",
    fill: "rgb(139 92 246)",
    border: "group-hover:border-violet-500/30",
    glow: "from-violet-500/10",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    fill: "rgb(16 185 129)",
    border: "group-hover:border-emerald-500/30",
    glow: "from-emerald-500/10",
  },
  orange: {
    icon: "bg-orange-500/10 text-orange-500 ring-orange-500/20",
    fill: "rgb(249 115 22)",
    border: "group-hover:border-orange-500/30",
    glow: "from-orange-500/10",
  },
};

const VIEW_W = 1200;
const VIEW_H = 20;

function buildWavePath(amplitude: number, cycles: number, phase = 0) {
  const period = VIEW_W / 2;
  const step = 8;
  let d = "";

  for (let x = 0; x <= VIEW_W; x += step) {
    const y =
      VIEW_H / 2 +
      amplitude * Math.sin((2 * Math.PI * cycles * x) / period + phase);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)} `;
  }

  return `${d}V${VIEW_H} H0 Z`;
}

const WAVE_BACK = buildWavePath(3.2, 2, 1.2);
const WAVE_FRONT = buildWavePath(2.4, 3, 0);

function WaveLayer({
  path,
  fill,
  opacity,
  duration,
  reverse,
  animated,
}: {
  path: string;
  fill: string;
  opacity: number;
  duration: number;
  reverse?: boolean;
  animated: boolean;
}) {
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      <motion.svg
        aria-hidden
        className="absolute bottom-full left-0 h-3.5 w-[200%] will-change-transform"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        initial={{ x: reverse ? "-50%" : "0%" }}
        animate={
          animated
            ? { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }
            : undefined
        }
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ marginBottom: -1 }}
      >
        <path d={path} fill={fill} />
      </motion.svg>

      <div className="absolute inset-0" style={{ backgroundColor: fill }} />
    </div>
  );
}

function Liquid({
  percentage,
  color,
}: {
  percentage: number;
  color: (typeof colors)["blue"];
}) {
  const level = Math.min(100, Math.max(0, percentage));
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
      initial={{ height: "0%" }}
      animate={{ height: `${level}%` }}
      transition={{ duration: 1.6, ease: [0.25, 0.8, 0.25, 1] }}
    >
      <WaveLayer
        path={WAVE_BACK}
        fill={color.fill}
        opacity={0.08}
        duration={14}
        reverse
        animated={!reduceMotion}
      />
      <WaveLayer
        path={WAVE_FRONT}
        fill={color.fill}
        opacity={0.12}
        duration={9}
        animated={!reduceMotion}
      />
    </motion.div>
  );
}

const STYLES = {
  good: { className: "bg-emerald-500/10 text-emerald-500", Icon: CheckCircle2 },
  warn: { className: "bg-amber-500/10 text-amber-500", Icon: AlertTriangle },
  bad: { className: "bg-red-500/10 text-red-500", Icon: XCircle },
} as const;

function TrendBadge({ status }: { status: Status }) {
  const { className, Icon } = STYLES[status.level];

  return (
    <div
      className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold tabular-nums ${className}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      <span>{status.label}</span>
    </div>
  );
}

export default function SystemStatCard({
  title,
  value,
  subtitle,
  percentage,
  icon: Icon,
  color,
  status,
}: SystemStatCardProps) {
  const style = colors[color];

  return (
    <div
      className={`group relative isolate flex min-h-50 min-w-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${style.border}`}
    >
      {/* Soft top highlight */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-linear-to-b to-transparent ${style.glow}`}
      />

      {percentage !== undefined && (
        <Liquid percentage={percentage} color={style} />
      )}

      {/* Header: icon + trend */}
      <div className="relative flex items-center justify-between gap-2">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 ${style.icon}`}
        >
          <Icon size={20} />
        </div>

        {status && <TrendBadge status={status} />}
      </div>

      {/* Title + value */}
      <div className="relative mt-4 min-w-0">
        <span className="block truncate text-xs font-medium text-muted-foreground">
          {title}
        </span>
        <h2 className="mt-1 truncate text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </h2>
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {/* Footer */}
      {percentage !== undefined && (
        <div className="relative mt-auto flex items-center justify-between border-t border-border/40 pt-3 text-xs">
          <span className="text-muted-foreground">Usage</span>
          <span className="font-semibold tabular-nums">
            {percentage.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
