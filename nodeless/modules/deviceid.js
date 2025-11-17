//Imported from Electron Modules deviceid.js
const newKey = () => crypto.randomUUID()

const getOstKey = () =>  localStorage.getItem("deviceID")

export const hasID = () => (localStorage.getItem("deviceID") !== null);

export function newID() {
  if (!hasID()) {
    const Key = newKey();
    const osKey = Key;
    localStorage.setItem("deviceID",osKey)
    return true
  } else {
    return false
  }
}

export function getID() {
  if (hasID()) {
    const osKey = localStorage.getItem("deviceID");
    const key = osKey
    return key
  } else {
    return false
  }
}

export function deleteID() {
  localStorage.removeItem("deviceID")
}