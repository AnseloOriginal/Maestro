import * as isDev from "electron-is-dev";
const mainURL = isDev.default ? "http://localhost/aba" : "http://192.168.1.2" //"http://192.168.1.2" //"http://localhost/aba"
const serverMainSpace = "server"
const serverStatusSpace = "status"
const serverCreateSpace = "create"
const serverDataSpace = "data"
const serverFilesSpace = "files"
const serverMonitorSpace = "monitor"
const serverRoomSpace = "rooms"
const serverPrivateDataSpace = "private/index.php"
const serverPublicConfigSpace = "public/config.php"
const serverPublicChangelogSpace = "public/changelog.php"
const serverNewAccountSpace = "account/index.php"
const serverNewMonitorIDSpace = "keypair/monitor.php"
const loginSpace = "login/index.php"
const serverFilesContentSpace = "list.php" //Previously content.php
const serverFilesDownloadSpace = "download.php"
const serverGetMonitorDataSpace = "get.php"
const serverTestDataSpace = "banks"
const serverMediaSpace = "media"
const serverTestNameSpace = "name.php"
const serverTestAccesSpace = "access.php"
const serverBankDetailsSpace = "bankdetails.php"
const serverTestInfoSpace = "info.php"
const serverTestEditSpace = "edit.php"
const serverTestSpace = "tests"
const serverGetTestQuestionsSpace = "get.php"
const serverRoomAvailableSpace = "available.php"
const serverRegisterRoomSpace = "register.php"
const serverRemoveRoomSpace = "remove.php"
const serverSendTestResultsSpace = "result.php"
const serverSendTestFinishSpace = "finish.php"
const serverTestDetailsSpace = "details.php"
const serverTestVariableSpace = "variable.php"
const serverTestFinalResultSpace = "finalresult.php"
const serverMediaLibrarySpace = "library.php"
const serverMediaVideoSpace = "video.php"
const serverMediaImageSpace = "image.php"

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

export function getTestNameDataURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestDataSpace, serverTestNameSpace)
}

export function getTestAccessDataURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestDataSpace, serverTestAccesSpace)
}

export function getBankDetailsDataURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestDataSpace, serverBankDetailsSpace)
}

export function getTestInfoDataURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestDataSpace, serverTestInfoSpace)
}

export function getTestEditDataURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestDataSpace, serverTestEditSpace)
}

export function getPublicDataConfigURL() {
  return apiJoin(mainURL,serverMainSpace,serverDataSpace,serverPublicConfigSpace)
}

export function getTestQuestionURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestSpace, serverGetTestQuestionsSpace)
}

export function getTestResultsURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestSpace, serverSendTestResultsSpace)
}

export function getTestFinishSignalURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestSpace, serverSendTestFinishSpace)
}

export function getTestDetailsURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestSpace, serverTestDetailsSpace)
}

export function getTestVariableURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestSpace, serverTestVariableSpace)
}

export function getAppChangelogURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverPublicChangelogSpace)
}

export function getTestFinalResultURL() {
  return apiJoin(mainURL,serverMainSpace, serverDataSpace, serverTestSpace, serverTestFinalResultSpace)
}

export function getMediaLibraryURL() {
  return apiJoin(mainURL,serverMainSpace, serverMediaSpace, serverMediaLibrarySpace)
}

export function getMediaVideoURL() {
  return apiJoin(mainURL,serverMainSpace, serverMediaSpace, serverMediaVideoSpace)
}

export function getMediaImageURL() {
  return apiJoin(mainURL,serverMainSpace, serverMediaSpace, serverMediaImageSpace)
}

export function getAvailableRoomsURL() {
  return apiJoin(mainURL,serverMainSpace, serverRoomSpace, serverRoomAvailableSpace)
}

export function getRegisterRoomURL() {
  return apiJoin(mainURL,serverMainSpace, serverRoomSpace, serverRegisterRoomSpace)
}

export function getRemoveRoomURL() {
  return apiJoin(mainURL,serverMainSpace, serverRoomSpace, serverRemoveRoomSpace)
}