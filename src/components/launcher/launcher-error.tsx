import { motion } from "motion/react";
import { TriangleAlert, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LauncherErrorProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export function LauncherError({
  message,
  title = "Something went wrong",
  onRetry,
  className,
}: LauncherErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex h-full w-full items-center justify-center p-4",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative flex w-full max-w-sm flex-col items-center gap-5 overflow-hidden rounded-2xl border-2 border-dashed border-destructive/40 bg-destructive/5 px-6 py-8"
      >
        {/* Ambient glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 h-24 w-40 -translate-x-1/2 rounded-full bg-destructive/20 blur-3xl"
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Icon */}
        <div className="relative flex size-14 items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-destructive/30"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 14,
              delay: 0.1,
            }}
            className="flex size-14 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/30"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -6, 6, 0] }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeInOut" }}
            >
              <TriangleAlert className="size-6 text-destructive" />
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
          <p className="max-h-24 w-full overflow-auto rounded-lg border border-destructive/20 bg-background/60 px-3 py-2 text-left font-mono text-xs wrap-break-word text-muted-foreground">
            {message}
          </p>
        </motion.div>

        {/* Retry */}
        {onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="group gap-2"
            >
              <RotateCw className="size-3.5 transition-transform duration-500 group-hover:rotate-180" />
              Try again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
