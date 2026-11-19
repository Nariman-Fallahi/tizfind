export interface AppInfo {
  name: string;
  exec: string | null;
  icon: string | null;
  iconData: string | null;
  comment: string | null;
  path: string;
  source: string;
  pinned: boolean;
  category: string;
}

export type ViewMode = "all" | "category";
export type LayoutMode = "grid" | "list";

export interface SystemOverview {
  cpu: {
    name: string;
    usage: number;
    logicalCores: number;
  };

  memory: {
    usedBytes: number;
    totalBytes: number;
    usage: number;
  };

  swap: {
    usedBytes: number;
    totalBytes: number;
    swapIn: number;
    swapOut: number;
  };

  disk: {
    usedBytes: number;
    totalBytes: number;
    usage: number;
  };

  system: {
    uptimeSeconds: number;
  };

  network: {
    downloadSpeed: number;
    uploadSpeed: number;
    totalDownload: number;
    totalUpload: number;
  };

  temperature: {
    temperature: number | null;
    cores: number[];
  };
}

export type ClipType = "text" | "link" | "code";

export interface ClipItem {
  id: string;
  text: string;
  type: ClipType;
  pinned: boolean;
  /** timestamp in ms */
  createdAt: number;
}
