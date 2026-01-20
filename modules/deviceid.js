import { safeStorage } from "electron";
import ElectronStore from "electron-store";
const store = new ElectronStore({encryptionKey: "aba encryption"})

export const newKey = () => crypto.randomUUID()

const getOstKey = () =>  store.get("deviceID")

export const hasID = () => store.has("deviceID");

export function newID() {
  if (!store.has("deviceID")) {
    const Key = newKey();
    const osKey = safeStorage.encryptString(Key)
    store.set("deviceID",osKey)
    return true
  } else {
    return false
  }
}

export function getID() {
  if (store.has("deviceID")) {
    const osKey = store.get("deviceID");
    const key = safeStorage.decryptString(Buffer.from(osKey))
    return key
  } else {
    return false
  }
}

export function deleteID() {
  store.delete("deviceID")
}

export function test() {
  if (store.has("deviceID")) {
    try {
      const osKey = store.get("deviceID");
      const key = safeStorage.decryptString(Buffer.from(osKey))
      return true
    } catch {
      return false
    }
  } else {
    return true
  }
}