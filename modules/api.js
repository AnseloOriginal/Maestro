const mainURL = "http://192.168.1.2"
const serverMainSpace = "server"
const serverStatusSpace = "status"
const serverCreateSpace = "create"
const serverDataSpace = "data"
const serverFilesSpace = "files"
const serverMonitorSpace = "monitor"
const serverPrivateDataSpace = "private/index.php"
const serverNewAccountSpace = "account/index.php"
const serverNewMonitorIDSpace = "keypair/monitor.php"
const loginSpace = "login/index.php"
const serverFilesContentSpace = "content.php"
const serverFilesDownloadSpace = "get.php"
const serverGetMonitorDataSpace = "get.php"

export const apiJoin = (...parts) => parts.join("/");

export function getStatusURL() {
  return apiJoin(mainURL,serverMainSpace,serverStatusSpace)
}

export function getCreateAccountURL() {
  return apiJoin(mainURL,serverMainSpace,serverCreateSpace,serverNewAccountSpace)
}

export function getLoginURL() {
  return apiJoin(mainURL,serverMainSpace,loginSpace)
}

export function getNewMonitorPairURL() {
  return apiJoin(mainURL,serverMainSpace,serverCreateSpace,serverNewMonitorIDSpace)
}

export function getPrivateData() {
  return apiJoin(mainURL,serverMainSpace,serverDataSpace,serverPrivateDataSpace)
}

export function getFilesContent() {
  return apiJoin(mainURL,serverMainSpace, serverFilesSpace, serverFilesContentSpace)
}

export function getFilesDownload() {
  return apiJoin(mainURL,serverMainSpace, serverFilesSpace, serverFilesDownloadSpace)
}

export function getMonitorDataURL() {
  return apiJoin(mainURL,serverMainSpace, serverMonitorSpace, serverGetMonitorDataSpace)
}
