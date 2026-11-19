import { motion } from "motion/react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { LayoutMode } from "@/types";

interface LauncherLoadingProps {
  layout?: LayoutMode;
  title?: string;
  description?: string;
  className?: string;
}

export function LauncherLoading({
  layout = "list",
  title = "Searching",
  description = "Getting your results ready",
  className,
}: LauncherLoadingProps) {
  const isGrid = layout === "grid";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex h-full w-full items-center justify-center p-4",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative flex w-full max-w-sm flex-col items-center gap-5 overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 px-6 py-8"
      >
        {/* Ambient glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Spinner */}
        <div className="relative flex size-14 items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Search className="size-5 text-primary" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center text-sm font-medium text-foreground">
            <span>{title}</span>
            <span className="ml-0.5 flex" aria-hidden>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                >
                  .
                </motion.span>
              ))}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        {/* Skeletons */}
        <div
          className={cn(
            "w-full",
            isGrid ? "grid grid-cols-3 gap-2" : "flex flex-col gap-2",
          )}
        >
          {[0, 1, 2].map((i) => (
            <SkeletonItem key={i} index={i} grid={isGrid} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SkeletonItem({ index, grid }: { index: number; grid: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted/50",
        grid
          ? "flex h-20 flex-col items-center justify-center gap-2 p-2"
          : "flex h-11 items-center gap-3 px-3",
      )}
    >
      <div
        className={cn(
          "shrink-0 rounded-md bg-muted-foreground/15",
          grid ? "size-8" : "size-6",
        )}
      />
      {grid ? (
        <div className="h-2 w-12 rounded bg-muted-foreground/15" />
      ) : (
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-2.5 w-2/5 rounded bg-muted-foreground/15" />
          <div className="h-2 w-3/5 rounded bg-muted-foreground/10" />
        </div>
      )}

      {/* Shimmer */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-foreground/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "300%" }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15,
        }}
      />
    </motion.div>
  );
}
