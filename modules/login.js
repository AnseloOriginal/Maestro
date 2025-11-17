import { safeStorage } from "electron";
import ElectronStore from "electron-store";
const store = new ElectronStore({encryptionKey: "aba encryption"})

export function clearLoginDetails() {
  return store.delete("LoginKey")
}

export function getLoginDetails() {
  if (store.has("LoginKey")) {
    const osKey = store.get("LoginKey")
    const key = safeStorage.decryptString(Buffer.from(osKey))
    return key
  }
}

export function saveLoginDetails(Details) {
  const osDetails = safeStorage.encryptString(Details)
  store.set("LoginKey",osDetails)
}

export function hasLoginDetails() { return store.has("LoginKey") }