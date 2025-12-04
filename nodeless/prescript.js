import * as runtime from "./modules/runtime.js"

if (!window.runtime) {
  window.runtime = {
    type: () => "nodeless",
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
    serverMonitorData: runtime.getMonitorNotes
  }
}

if (!window.fs) {
  window.fs = {
    notes: async () => runtime.getOfflineNotes(),
    download: async (file) => runtime.addDownload(file),
    open: runtime.openFile,
    blob: async (filename) => await runtime.getFileURL(filename),
    recents: () => runtime.getRecentNotes(),
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
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification("Hellos")
  })
} else {
  console.error("Service workers are not supported.");
}
