import { EventMap } from "./types";

export function addEventHandler<K extends keyof EventMap>(
  name: K, 
  func: (event: EventMap[K]) => void) 
{
  window.addEventListener(name, (evt) => {
    const e = evt as CustomEvent
    const data = e.detail as EventMap[K]
    func(data)
  })
}