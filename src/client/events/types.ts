
export interface EventMap {
  "server-ping": ServerPingEvent 
}
export interface ServerPingEvent {
  online: boolean
}