import OverviewContent from "@/components/dashboard/overview/content";
import PageSwitcher from "@/components/shared/page-switcher";

import { Separator } from "@/components/ui/separator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ClipboardList, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen rounded-xl flex flex-col bg-popover text-popover-foreground">
      <Tabs defaultValue="overview" className="w-full flex flex-col">
        {/* Header */}
        <div className="w-full grid grid-cols-3 items-center px-3 pt-2">
          {/* Left: Dashboard */}
          <div className="flex items-center gap-2 justify-self-start h-9">
            <LayoutDashboard size={19} strokeWidth={2} className="shrink-0" />

            <span className="text-sm font-semibold leading-none">
              Dashboard
            </span>
          </div>

          {/* Center: Tabs */}
          <TabsList className="justify-self-center h-9 rounded-full p-1">
            <TabsTrigger
              value="overview"
              className="h-7 rounded-full px-4 text-sm"
            >
              <LayoutDashboard size={15} />
              Overview
            </TabsTrigger>

            <TabsTrigger
              value="clipboard"
              className="h-7 rounded-full px-4 text-sm"
            >
              <ClipboardList size={15} />
              Clipboard
            </TabsTrigger>
          </TabsList>

          {/* Right: Page Switcher */}
          <div className="justify-self-end flex items-center h-9">
            <PageSwitcher />
          </div>
        </div>

        <Separator />

        {/* Overview */}
        <TabsContent value="overview" className="w-full mt-1">
          <OverviewContent />
        </TabsContent>

        <TabsContent value="clipboard" className="w-full mt-1"></TabsContent>
      </Tabs>
    </div>
  );
}
