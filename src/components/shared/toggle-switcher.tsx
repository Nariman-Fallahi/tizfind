import type { LucideIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SwitcherOption<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
}

interface ToggleSwitcherProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly SwitcherOption<T>[];
  ariaLabel: string;
  spacing?: number;
}

export function ToggleSwitcher<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  spacing = 1,
}: ToggleSwitcherProps<T>) {
  return (
    <TooltipProvider>
      <ToggleGroup
        value={[value]}
        onValueChange={(values) => {
          if (values.length > 0) {
            onChange(values[0] as T);
          }
        }}
        aria-label={ariaLabel}
        spacing={spacing}
      >
        {options.map(({ value, label, icon: Icon }) => (
          <Tooltip key={value}>
            <TooltipTrigger
              render={<ToggleGroupItem value={value} aria-label={label} />}
            >
              <Icon className="size-4" />
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </TooltipProvider>
  );
}
