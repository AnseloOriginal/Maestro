
export interface EventMap {
  "server-ping": ServerPingEvent
  "app-download-info": DownloadInfoEvent
}

export interface ServerPingEvent {
  online: boolean
}

export interface DownloadInfoEvent {
  download: string
  status: "complete" | "error"
}