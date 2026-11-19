import SystemStatCard from "@/components/dashboard/overview/system-stat-card";
import NetworkStatCard from "@/components/dashboard/overview/network-stat-card";
import TempStatCard from "@/components/dashboard/overview/temp-stat-card";

import { Cpu, MemoryStick, HardDrive, Clock } from "lucide-react";
import SwapStatCard from "@/components/dashboard/overview/swap-stat-card";
import { useSystemOverview } from "@/hooks/use-system-overview";
import { uptimeStatus, usageStatus } from "@/lib/status";

export default function OverviewContent() {
  const system = useSystemOverview();

  return (
    <div className="w-full px-5 py-1 flex flex-col gap-3">
      {/* System Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <SystemStatCard
          title="CPU Usage"
          value={`${(system?.cpu.usage ?? 0).toFixed(1)}%`}
          subtitle={`${system?.cpu.name} · ${system?.cpu.logicalCores} Logical Cores`}
          percentage={system?.cpu.usage}
          icon={Cpu}
          color="blue"
          status={system ? usageStatus(system.cpu.usage) : undefined}
        />

        <SystemStatCard
          title="Memory Usage"
          value={`${((system?.memory.usedBytes ?? 0) / 1024 ** 3).toFixed(1)} GB`}
          subtitle={`${((system?.memory.totalBytes ?? 0) / 1024 ** 3).toFixed(1)} GB Total Memory`}
          percentage={system?.memory.usage}
          icon={MemoryStick}
          color="violet"
          status={
            system
              ? usageStatus(system.memory.usage, { warnAt: 75 })
              : undefined
          }
        />

        <SystemStatCard
          title="Storage"
          value={`${((system?.disk.usedBytes ?? 0) / 1024 ** 3).toFixed(0)} GB`}
          subtitle={`${((system?.disk.totalBytes ?? 0) / 1024 ** 3).toFixed(0)} GB Total Storage`}
          percentage={system?.disk.usage}
          icon={HardDrive}
          color="emerald"
          status={
            system
              ? usageStatus(system.disk.usage, {
                  warnAt: 80,
                  labels: {
                    good: "Healthy",
                    warn: "Filling up",
                    bad: "Almost full",
                  },
                })
              : undefined
          }
        />

        <SystemStatCard
          title="System Uptime"
          value={formatUptime(system?.system.uptimeSeconds ?? 0)}
          subtitle="Since last system boot"
          icon={Clock}
          color="orange"
          status={
            system ? uptimeStatus(system.system.uptimeSeconds) : undefined
          }
        />
      </div>

      {/* Network Statistics */}
      <NetworkStatCard
        downloadSpeed={system?.network.downloadSpeed ?? 0}
        uploadSpeed={system?.network.uploadSpeed ?? 0}
        totalDownload={system?.network.totalDownload ?? 0}
        totalUpload={system?.network.totalUpload ?? 0}
      />

      {/* Temperature Statistics */}
      <TempStatCard
        temperature={system?.temperature.temperature ?? 0}
        cores={system?.temperature.cores}
        max={120}
      />

      {/* Swap Statistics */}
      <SwapStatCard
        used={system?.swap.usedBytes ?? 0}
        total={system?.swap.totalBytes ?? 0}
      />
    </div>
  );
}

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);

  return `${days}d ${String(hours).padStart(2, "0")}h`;
};
