import { sendEvent } from "./send";

export function listenToElectron() {
  window.runtime.onDownloadComplete((info) => sendEvent("app-download-info",info))
}