import * as runtime from "./modules/runtime.js"
import { decrypt, arrayBufferToBase64, base64ToArrayBuffer, dump } from "./modules/filemanager.js"
const isCapactior = window.Capacitor !== undefined
let type = "nodeless"
if (isCapactior) {
  type = "capacitor"
}

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
    publicConfig: runtime.getPublicConfigData
  }
}

if (!window.fs) {
  window.fs = {
    notes: async () => runtime.getOfflineNotes(),
    download: async (file) => runtime.addDownload(file),
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
    info: runtime.getTestInfoData,
    add: runtime.addNewTestData
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
