import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SystemOverview } from "@/types";

async function getSystemOverview(): Promise<SystemOverview> {
  return await invoke<SystemOverview>("get_system_overview");
}

export function useSystemOverview(intervalMs = 1000) {
  const [system, setSystem] = useState<SystemOverview | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      try {
        const data = await getSystemOverview();
        if (!cancelled) setSystem(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) timer = setTimeout(tick, intervalMs);
      }
    };

    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [intervalMs]);

  return system;
}
