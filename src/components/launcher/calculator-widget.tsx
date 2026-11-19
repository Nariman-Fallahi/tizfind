import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Delete, Equal, History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateSafe } from "@/lib/math-evaluator";
import { cn } from "@/lib/utils";

interface CalculatorWidgetProps {
  externalExpression: string;
  onExpressionChange: (newExpr: string) => void;
}

interface CalcButton {
  label: string;
  value: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  className?: string;
}

const KEYPAD_ROWS: CalcButton[][] = [
  [
    {
      label: "C",
      value: "CLEAR",
      variant: "secondary",
      className: "text-destructive",
    },
    { label: "(", value: "(", variant: "secondary" },
    { label: ")", value: ")", variant: "secondary" },
    { label: "x²", value: "^2", variant: "secondary" },
    { label: "√", value: "sqrt(", variant: "secondary" },
    {
      label: "÷",
      value: "/",
      variant: "secondary",
      className: "text-primary font-semibold",
    },
  ],
  [
    { label: "sin", value: "sin(", variant: "secondary" },
    { label: "7", value: "7", variant: "outline" },
    { label: "8", value: "8", variant: "outline" },
    { label: "9", value: "9", variant: "outline" },
    { label: "π", value: "π", variant: "secondary" },
    {
      label: "×",
      value: "*",
      variant: "secondary",
      className: "text-primary font-semibold",
    },
  ],
  [
    { label: "cos", value: "cos(", variant: "secondary" },
    { label: "4", value: "4", variant: "outline" },
    { label: "5", value: "5", variant: "outline" },
    { label: "6", value: "6", variant: "outline" },
    { label: "e", value: "e", variant: "secondary" },
    {
      label: "−",
      value: "-",
      variant: "secondary",
      className: "text-primary font-semibold",
    },
  ],
  [
    { label: "tan", value: "tan(", variant: "secondary" },
    { label: "1", value: "1", variant: "outline" },
    { label: "2", value: "2", variant: "outline" },
    { label: "3", value: "3", variant: "outline" },
    { label: "log", value: "log(", variant: "secondary" },
    {
      label: "+",
      value: "+",
      variant: "secondary",
      className: "text-primary font-semibold",
    },
  ],
  [
    { label: "ln", value: "ln(", variant: "secondary" },
    { label: "%", value: "%", variant: "outline" },
    { label: "0", value: "0", variant: "outline" },
    { label: ".", value: ".", variant: "outline" },
    { label: "^", value: "^", variant: "secondary" },
    { label: "=", value: "EVAL", variant: "default", className: "font-bold" },
  ],
];

export function CalculatorWidget({
  externalExpression,
  onExpressionChange,
}: CalculatorWidgetProps) {
  const [expression, setExpression] = useState(externalExpression);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ expr: string; res: string }>>(
    [],
  );

  useEffect(() => {
    setExpression(externalExpression);
  }, [externalExpression]);

  const liveResult = calculateSafe(expression);

  const updateBoth = (nextValue: string) => {
    setExpression(nextValue);
    onExpressionChange(nextValue);
  };

  const handleCopy = async () => {
    const target = liveResult ?? expression;
    if (!target) return;

    await navigator.clipboard.writeText(target);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleKeyPress = (btn: CalcButton) => {
    if (btn.value === "CLEAR") {
      updateBoth("");
      return;
    }

    if (btn.value === "EVAL") {
      if (liveResult) {
        setHistory((prev) => [
          { expr: expression, res: liveResult },
          ...prev.slice(0, 4),
        ]);
        updateBoth(liveResult);
      }
      return;
    }

    updateBoth(expression + btn.value);
  };

  const handleBackspace = () => {
    updateBoth(expression.slice(0, -1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="mx-auto w-full max-w-xl p-3"
    >
      <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col justify-between bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-[11px] font-normal">
              Scientific Calculator
            </Badge>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleBackspace}
                disabled={!expression}
              >
                <Delete className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => updateBoth("")}
                disabled={!expression}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-col items-end gap-1 overflow-hidden">
            <div className="w-full truncate text-right font-mono text-sm text-muted-foreground">
              {expression || "0"}
            </div>

            <div className="flex w-full items-center justify-between gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!liveResult}
                className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>

              <div className="flex items-center gap-1.5 truncate font-mono text-3xl font-bold tracking-tight">
                {liveResult ? (
                  <>
                    <Equal className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{liveResult}</span>
                  </>
                ) : (
                  <span className="text-xl font-normal text-muted-foreground">
                    ...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid gap-1.5 p-3">
          {KEYPAD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-6 gap-1.5">
              {row.map((btn) => (
                <Button
                  key={btn.label}
                  type="button"
                  variant={btn.variant ?? "outline"}
                  onClick={() => handleKeyPress(btn)}
                  className={cn(
                    "h-10 font-mono text-sm transition-transform active:scale-95",
                    btn.className,
                  )}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          ))}
        </div>

        {history.length > 0 && (
          <>
            <Separator />
            <div className="bg-muted/20 px-3 py-2">
              <div className="mb-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <History className="h-3 w-3" />
                <span>Recent Calculations</span>
              </div>
              <div className="flex flex-col gap-1">
                {history.map((item, idx) => (
                  <button
                    key={`${item.expr}-${idx}`}
                    type="button"
                    onClick={() => updateBoth(item.res)}
                    className="flex items-center justify-between rounded-md px-2 py-1 text-left font-mono text-xs transition-colors hover:bg-muted"
                  >
                    <span className="truncate text-muted-foreground">
                      {item.expr}
                    </span>
                    <span className="font-semibold text-foreground">
                      = {item.res}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
