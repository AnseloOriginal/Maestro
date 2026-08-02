
export interface EventMap {
  "server-ping": ServerPingEvent
  "app-download-info": DownloadInfoEvent,
  "update-event": AppUpdateEvent
}

export interface ServerPingEvent {
  online: boolean
}

export interface DownloadInfoEvent {
  download: string
  status: "complete" | "error"
}

export interface AppUpdateEvent {
  newVersion: string
  oldVersion: string
}