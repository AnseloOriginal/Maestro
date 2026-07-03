import { EventMap } from "./types";

export function sendEvent<K extends keyof EventMap>(name: K, data: EventMap[K]) {
  const event = new CustomEvent(name,{
    "detail": data
  })
  window.dispatchEvent(event)
}