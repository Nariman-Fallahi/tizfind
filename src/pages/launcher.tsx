import { Activity, useState } from "react";
import { AnimatePresence } from "motion/react";

import { Command, CommandInput } from "@/components/ui/command";
import { AppList } from "@/components/launcher/app-list";
import { CalculatorWidget } from "@/components/launcher/calculator-widget";
import { Separator } from "@/components/ui/separator";
import { Grid2X2, Layers, LayoutList, List } from "lucide-react";
import { ToggleSwitcher } from "@/components/shared/toggle-switcher";
import PageSwitcher from "@/components/shared/page-switcher";
import { useApps } from "@/hooks/use-apps";
import { analyzeMathInput } from "@/lib/math-evaluator";

const viewOptions = [
  { value: "all", label: "All apps", icon: List },
  { value: "category", label: "By category", icon: Layers },
] as const;

const layoutOptions = [
  { value: "list", label: "List view", icon: LayoutList },
  { value: "grid", label: "Grid view", icon: Grid2X2 },
] as const;

export default function Launcher() {
  const [search, setSearch] = useState("");

  const {
    apps,
    error,
    loading,
    launch,
    togglePin,
    view,
    changeView,
    layout,
    changeLayout,
  } = useApps();

  const mathAnalysis = analyzeMathInput(search);
  const query = search.toLowerCase().trim();

  const filteredApps = mathAnalysis.isMath
    ? []
    : apps.filter((app) => {
        if (!query) return true;

        return (
          app.name.toLowerCase().includes(query) ||
          app.comment?.toLowerCase().includes(query) ||
          app.category.toLowerCase().includes(query) ||
          app.path.toLowerCase().includes(query)
        );
      });

  return (
    <Command shouldFilter={false} className="h-screen w-full border">
      <CommandInput
        placeholder="Search apps or calculate (e.g. 24 * 15)..."
        value={search}
        onValueChange={setSearch}
        className="rounded-xl!"
      />

      {!mathAnalysis.isMath && (
        <div className="flex w-full items-center justify-between border-b px-2 py-1">
          <div className="flex gap-1">
            <ToggleSwitcher
              value={view}
              onChange={changeView}
              options={viewOptions}
              ariaLabel="View mode"
            />

            <Separator orientation="vertical" />

            <ToggleSwitcher
              value={layout}
              onChange={changeLayout}
              options={layoutOptions}
              ariaLabel="Layout mode"
            />
          </div>

          <PageSwitcher />
        </div>
      )}

      <AnimatePresence mode="wait">
        <Activity mode={mathAnalysis.isMath ? "visible" : "hidden"}>
          <div
            key="calculator"
            className="flex flex-1 items-center justify-center overflow-y-auto"
          >
            <CalculatorWidget
              externalExpression={search}
              onExpressionChange={setSearch}
            />
          </div>
        </Activity>

        <Activity mode={mathAnalysis.isMath ? "hidden" : "visible"}>
          <AppList
            key="app-list"
            apps={filteredApps}
            view={view}
            layout={layout}
            loading={loading}
            error={error}
            onLaunch={launch}
            onTogglePin={togglePin}
            onRetry={() => null}
            query={query}
          />
        </Activity>
      </AnimatePresence>
    </Command>
  );
}
