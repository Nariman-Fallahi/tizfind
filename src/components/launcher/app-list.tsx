import { useMemo } from "react";

import { CommandList } from "@/components/ui/command";
import { AppInfo, LayoutMode, ViewMode } from "@/types";
import { cn } from "@/lib/utils";

import {
  PinnedList,
  PinnedListItems,
  PinnedListLabel,
  PinnedListPinned,
  PinnedListUnpinned,
} from "@animate-ui/react/primitives/pinned-list";
import { AppListItem } from "./app-list-item";
import { LauncherLoading } from "./launcher-loading.tsx";
import { LauncherEmpty } from "./launcher-empty.tsx";
import { LauncherError } from "./launcher-error.tsx";

interface AppListProps {
  apps: AppInfo[];
  view: ViewMode;
  layout: LayoutMode;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  onLaunch: (app: AppInfo) => void;
  onTogglePin: (path: string) => void;
  query?: string;
}

export function AppList({
  apps,
  view,
  layout,
  loading,
  error,
  onRetry,
  onLaunch,
  onTogglePin,
  query,
}: AppListProps) {
  const pinnedApps = apps.filter((app) => app.pinned);
  const otherApps = apps.filter((app) => !app.pinned);

  const itemsClass = cn(
    layout === "grid"
      ? "grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-2 px-2"
      : "flex flex-col",
  );

  const renderItem = (app: AppInfo) => (
    <AppListItem key={app.path} app={app} layout={layout} onLaunch={onLaunch} />
  );

  const groups = useMemo(() => {
    const map = new Map<string, AppInfo[]>();
    for (const app of apps.filter((a) => !a.pinned)) {
      const list = map.get(app.category) ?? [];
      list.push(app);
      map.set(app.category, list);
    }
    return [...map.entries()].sort(([a], [b]) =>
      a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b),
    );
  }, [apps]);

  return (
    <CommandList className="max-h-full p-1">
      {error && <LauncherError message={error} onRetry={onRetry} />}

      {loading ? (
        <p className="p-4 text-sm text-muted-foreground">
          <LauncherLoading layout={layout} />
        </p>
      ) : apps.length === 0 ? (
        <LauncherEmpty query={query} />
      ) : (
        <PinnedList
          onPinnedChange={onTogglePin}
          className="flex flex-col gap-3"
        >
          <PinnedListPinned>
            <PinnedListLabel
              hide={pinnedApps.length === 0}
              className="px-2 py-2 text-xs font-medium text-muted-foreground"
            >
              Pinned
            </PinnedListLabel>

            <PinnedListItems className={itemsClass}>
              {pinnedApps.map(renderItem)}
            </PinnedListItems>
          </PinnedListPinned>

          <PinnedListUnpinned>
            {view === "all" ? (
              <>
                <PinnedListLabel
                  hide={otherApps.length === 0}
                  className="px-2 py-2 text-xs font-medium text-muted-foreground"
                >
                  Applications
                </PinnedListLabel>

                <PinnedListItems className={itemsClass}>
                  {otherApps.map(renderItem)}
                </PinnedListItems>
              </>
            ) : (
              groups.map(([category, list]) => (
                <div key={category}>
                  <p className="px-2 py-2 text-xs font-medium text-muted-foreground">
                    {category}
                  </p>

                  <PinnedListItems className={itemsClass}>
                    {list.map(renderItem)}
                  </PinnedListItems>
                </div>
              ))
            )}
          </PinnedListUnpinned>
        </PinnedList>
      )}
    </CommandList>
  );
}
