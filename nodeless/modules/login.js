//Imported from Electron Modules login.js

export function clearLoginDetails() {
  localStorage.removeItem("LoginKey")
}

export function getLoginDetails() {
  if (localStorage.getItem("LoginKey")) {
    const osKey = localStorage.getItem("LoginKey")
    const key = osKey
    return key
  }
}

export function saveLoginDetails(Details) {
  const osDetails = Details
  localStorage.setItem("LoginKey",osDetails)
}

export function hasLoginDetails() { return (localStorage.getItem("LoginKey") !== null) }