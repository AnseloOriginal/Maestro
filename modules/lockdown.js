import { safeStorage } from "electron";
import ElectronStore from "electron-store";
const store = new ElectronStore({encryptionKey: "aba encryption"})

export function clearLockdownDetails() {
  return store.delete("LockdownKey")
}

export function getLockdownDetails() {
  if (store.has("LockdownKey")) {
    const osKey = store.get("LockdownKey")
    const key = safeStorage.decryptString(Buffer.from(osKey))
    return key
  }
}

export function saveLockdownDetails(bol) {
  const osDetails = safeStorage.encryptString(bol)
  store.set("LockdownKey",osDetails)
}

export function hasLockdownDetails() { return store.has("LockdownKey") }