import { motion } from "motion/react";
import { SearchX } from "lucide-react";

import { cn } from "@/lib/utils";

interface LauncherEmptyProps {
  query?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function LauncherEmpty({
  query,
  title = "No results found",
  description = "Try a different keyword or check the spelling",
  className,
}: LauncherEmptyProps) {
  const trimmed = query?.trim();

  return (
    <div
      role="status"
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
          className="pointer-events-none absolute -top-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Icon */}
        <div className="relative flex size-14 items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-muted-foreground/20"
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 16,
              delay: 0.1,
            }}
            className="flex size-14 items-center justify-center rounded-full bg-muted/60 ring-1 ring-border"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -6, 6, 0], y: [0, -2, 0] }}
              transition={{
                duration: 1.2,
                delay: 0.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            >
              <SearchX className="size-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex w-full flex-col items-center gap-2 text-center"
        >
          <p className="text-sm font-medium text-foreground">{title}</p>

          {trimmed && (
            <p
              dir="auto"
              className="max-w-full truncate rounded-md border border-border bg-background/60 px-2.5 py-1 font-mono text-xs text-muted-foreground"
              title={trimmed}
            >
              {trimmed}
            </p>
          )}

          <p className="text-xs text-muted-foreground">{description}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
