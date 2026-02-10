import * as runtime from "./modules/runtime.js"
import { decrypt, arrayBufferToBase64, base64ToArrayBuffer, dump } from "./modules/filemanager.js"
const isCapactior = window.Capacitor !== undefined
let type = "nodeless"
if (isCapactior) {
  type = "capacitor"
}
const APP_VERSION = "1.9.2"
if (!window.runtime) {
  window.runtime = {
    type: () => type,
    init: runtime.Initialization,
    login: runtime.freshLogin,
    createNewAccount: (message) => runtime.newAccount(message),
    newSession: runtime.getSession,
    logout: runtime.logout,
    serverOnline: runtime.serverStatus,
    submitServerAction: runtime.submitServerAction,
    onDownloadComplete: (callback) => document.addEventListener("note-download-complete", e => {
        callback(e.detail)
    })
  }
}

if (!window.server) {
  window.server = {
    serverUserInfo: runtime.getServerInfo,
    serverNotesInfo: runtime.getOnlineNotes,
    serverMonitorData: runtime.getMonitorNotes,
    publicConfig: runtime.getPublicConfigData,
    getAppChangelog: () => runtime.Initialization
  }
}

if (!window.fs) {
  window.fs = {
    notes: async () => runtime.getOfflineNotes(),
    download: async (file) => runtime.addDownload(file),
    banks: () => {return []},
    open: (propety) => {
      if (isCapactior) {
        runtime.openFile(propety,false)
        return window.urls.notes(propety)
      } else {
        return runtime.openFile(propety,true)
      }
    },
    blob: async (filename) => await runtime.getFileURL(filename),
    recents: () => runtime.getRecentNotes(),
  }
}

if (!window.test) {
  window.test = {
    names: runtime.getTestNameData,
    access: runtime.getTestAccessData,
    bankDetails: runtime.getBankDetails,
    info: runtime.getTestInfoData,
    add: runtime.addNewTestData,
    questions: runtime.getTestQuestions,
    results: runtime.sendTestResult,
    submit: runtime.finishTest,
    details: runtime.getTestDetails,
    variable: runtime.TestVariable,
    mode: runtime.SetTestMode,
    generate: () => console.warn("[TESTS] Offline test not supported"),
    offline: () => console.warn("[TESTS] Offline test not supported"),
    displayResult: async (uuid,location,data) => {
      const result = await runtime.getFinalTestResult(uuid)
      localStorage.setItem("lasttobeviewedresult",JSON.stringify(result))
      localStorage.setItem("lasttobevieweddata",JSON.stringify(data))
      window.open(`${
        window.location.pathname.replace("dashboard","result")
      }`, '_blank');
      loca
    },
    result: () => localStorage.getItem("lasttobeviewedresult"),
    data: () => localStorage.getItem("lasttobevieweddata")
  }
}

if (!window.sys) {
  window.sys = {
    fullscreen: (bol) => runtime.requestFullscreen(bol),
    requestLock: () => console.warn("Lock not supported"),
    requestUnlock: () => console.warn("Lock not supported"),
    appVersion: () => APP_VERSION
  }  
}

if (isCapactior) {
  window.urls = {
    notes: async (file) => {
      const path = "notes/"+file
      try {
      const encrypted = await Capacitor.Plugins.Filesystem.readFile({
        path: path,
        directory: "DATA"
      });
      const buffer = base64ToArrayBuffer(encrypted.data)
      dump(buffer);
      const decryptedBytes = await decrypt(buffer,"aba1234");
      
      const tempFilename = decryptedBytes.meta?.name || "temp"
      const tempPath = `${tempFilename}.pdf`
      await Capacitor.Plugins.Filesystem.writeFile({
        path: tempPath,
        data: arrayBufferToBase64(decryptedBytes.decrypted),
        directory: "CACHE",
        recursive: true
      });
      
      const uri = await Capacitor.Plugins.Filesystem.getUri({
        path: tempPath,
        directory: "CACHE"
      });

      await Capacitor.Plugins.FileOpener.open({
        filePath: uri.uri,
        contentType: 'application/pdf'
      });
      } catch(e) {
        console.log("Error while getting notes uri:",e)
        return ""
      }
    }
  }
}
// Does "serviceWorker" exist
if ("serviceWorker" in navigator && window.runtime.type() !== "node") {
  navigator.serviceWorker.register("./../service-worker.js",{type: 'module'}).then(
    (registration) => {
      console.log("Service worker registration successful:", registration);
    },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    },
  );
} else {
  console.error("Service workers are not supported.");
}
