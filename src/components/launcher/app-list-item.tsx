import { Pin } from "lucide-react";

import { cn } from "@/lib/utils";
import { CommandItem } from "@/components/ui/command";

import {
  PinnedListItem,
  PinnedListTrigger,
} from "@animate-ui/react/primitives/pinned-list";

import {
  IconButton,
  IconButtonParticles,
} from "@animate-ui/react/primitives/buttons/icon";

import { AppInfo, LayoutMode } from "@/types";

interface AppListItemProps {
  app: AppInfo;
  layout: LayoutMode;
  onLaunch: (app: AppInfo) => void;
}

export function AppListItem({ app, layout, onLaunch }: AppListItemProps) {
  const isGrid = layout === "grid";

  return (
    <PinnedListItem id={app.path} customTrigger className="h-full w-full">
      <CommandItem
        value={app.path}
        onSelect={() => onLaunch(app)}
        className={cn(
          "relative flex w-full transition-transform duration-200 ease-out",
          "active:translate-y-px active:scale-[0.99]",
          isGrid
            ? "h-full max-h-50 flex-col items-center justify-start gap-3 border p-4 text-center"
            : "group items-center gap-3",
        )}
      >
        {/* App Icon */}
        {app.iconData ? (
          <img
            src={app.iconData}
            alt=""
            className={cn(
              "shrink-0 object-contain",
              isGrid ? "size-12" : "size-6",
            )}
          />
        ) : (
          <div
            className={cn(
              "shrink-0 rounded bg-muted",
              isGrid ? "size-12" : "size-6",
            )}
          />
        )}

        {/* App Information */}
        <div
          className={cn(
            "min-w-0",
            isGrid
              ? "flex w-full flex-1 flex-col items-center justify-center text-center"
              : "flex flex-1 flex-col",
          )}
        >
          <span className={cn("w-full truncate", isGrid && "text-center")}>
            {app.name}
          </span>

          {app.comment && (
            <span
              className={cn(
                "text-xs text-muted-foreground",
                isGrid ? "line-clamp-2 min-h-8 w-full text-center" : "truncate",
              )}
            >
              {app.comment}
            </span>
          )}

          {isGrid && !app.comment && <span className="min-h-8 w-full" />}
        </div>

        {/* Pin Button */}
        <PinnedListTrigger asChild>
          <IconButton className={cn("cursor-pointer rounded-full border p-1")}>
            <Pin
              className={cn(
                "size-4 transition-colors",
                app.pinned && "fill-current text-primary",
              )}
            />

            <IconButtonParticles className="text-neutral-500" />
          </IconButton>
        </PinnedListTrigger>
      </CommandItem>
    </PinnedListItem>
  );
}
