import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { AppInfo, LayoutMode, ViewMode } from "@/types";

const VIEW_KEY = "view-mode";
const LAYOUT_KEY = "layout-mode";

export function useApps() {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>(
    () => (localStorage.getItem(VIEW_KEY) as ViewMode) ?? "all",
  );
  const [layout, setLayout] = useState<LayoutMode>(
    () => (localStorage.getItem(LAYOUT_KEY) as LayoutMode) ?? "list",
  );

  useEffect(() => {
    invoke<AppInfo[]>("list_apps")
      .then(setApps)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const launch = (app: AppInfo) => {
    if (!app.exec) return;
    invoke("launch_app", { exec: app.exec }).catch((e) => setError(String(e)));
  };

  const togglePin = async (path: string) => {
    try {
      setError(null);
      const pinned = await invoke<boolean>("toggle_pin", { path });

      setApps((prev) =>
        prev
          .map((app) => (app.path === path ? { ...app, pinned } : app))
          .sort(
            (a, b) =>
              Number(b.pinned) - Number(a.pinned) ||
              a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
          ),
      );
    } catch (e) {
      setError(String(e));
    }
  };

  const changeView = (v: ViewMode) => {
    localStorage.setItem(VIEW_KEY, v);
    setView(v);
  };

  const changeLayout = (l: LayoutMode) => {
    localStorage.setItem(LAYOUT_KEY, l);
    setLayout(l);
  };

  return {
    apps,
    error,
    loading,
    launch,
    togglePin,
    view,
    changeView,
    layout,
    changeLayout,
  };
}
