import {getFileContent, decrypt} from "./nodeless/modules/filemanager.js";
let lastMeta = {};

const main_htmls = [
  "/app/",
  "/app/src/",
  "/app/src/index.html",
  "/app/src/dashboard.html",
  "/app/src/fileviewer.html",
  "/app/src/login.html",
  "/app/src/new.html",
]

const docs = [
  "/app/src/docs/",
  "/app/src/docs/forgot.html",
]

const images = [
  "/app/src/images/",
  "/app/src/images/material-symbols",
  "/app/src/images/material-symbols/rounded.css",
  "/app/src/images/material-symbols/material-symbols-rounded.woff2",  
  "/app/src/images/material-symbols/material-symbols-outlined.woff2",
  "/app/src/images/material-symbols/outlined.css",
  "/app/src/images/error.png",
  "/app/src/images/logo.png",
  "/app/src/images/success.png",
]

const main_scripts = [
  "/app/src/scripts/",
  "/app/src/scripts/fileviewer.js",
  "/app/src/scripts/loading.js",
  "/app/src/scripts/login.js",
  "/app/src/scripts/main.js",
  "/app/src/scripts/new-account.js", 
]

const pdjs = [

]

const dashboard = [
  "/app/src/scripts/dashboard-elements/",
  "/app/src/scripts/dashboard-elements/dashboard.js",
  "/app/src/scripts/dashboard-elements/manager.js",
  "/app/src/scripts/dashboard-elements/render.js",
  "/app/src/scripts/dashboard-elements/ui.js",
  "/app/src/scripts/dashboard-elements/watcher.js",
  "/app/src/scripts/dashboard-elements/render",
  "/app/src/scripts/dashboard-elements/render/alert.js",
  "/app/src/scripts/dashboard-elements/render/monitor.js",
  "/app/src/scripts/dashboard-elements/render/alert.js"
]

const styles = [
  "/app/src/styles/",
  "/app/src/styles/general-form.css",
  "/app/src/styles/loading.css",
  "/app/src/styles/login.css",
  "/app/src/styles/slider.css",
  "/app/src/styles/new-account.css",
  "/app/src/styles/main",
  "/app/src/styles/main/alert.css",
  "/app/src/styles/main/general.css",
  "/app/src/styles/main/monitor.css",
  "/app/src/styles/main/notes.css"
]

const APP_STATIC_RESOURCES = [
  ...main_htmls,
  ...docs,
  ...images,
  ...main_scripts,
  ...pdjs,
  ...styles
];

const VERSION = "v0.0.4";
const CACHE_NAME =  `Maestro Cache ${VERSION}`

self.addEventListener("install", (event) => {
  self.skipWaiting()
  const preCache = async () => {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(APP_STATIC_RESOURCES);
  };
  event.waitUntil(preCache());
});

self.addEventListener("activate", (event) => {
  registerNotification("BDd3_hVL9fZi9Ybo2UUzA284WG5FZR30_95YeZJsiA321")
  const removeOldCache = async () => {
    const names = await caches.keys();
    await Promise.all(
      names.map((name) => {
        if (name !== CACHE_NAME) {
          return caches.delete(name);
        }
        return undefined;
      }
    ))
  }
  event.waitUntil(removeOldCache())
})

async function cacheThenNetwork(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    //console.log("Found response in cache:", cachedResponse);
    return cachedResponse;
  }
  //console.log("Falling back to network");
  return fetch(request);
}

async function responseBlob(name,url) {
  let blob = await getFileContent(name)
  const deArray = await decrypt(await blob.arrayBuffer(), "aba1234")
  const deBlob = new Blob([deArray.decrypted], {type: "application/pdf"})
  const response = new Response(deBlob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": blob.size,
      //"Content-Disposition": "attachment; filename=test.pdf"
    }
  })
  return response
}

self.addEventListener("fetch", (event) => {
  //console.log(`Handling fetch event for ${event.request.url}`);

  const url = event.request.url
  if (url.includes("pdfblobaba")) {
    const index = url.indexOf("pdfblobaba")+11
    let filename = decodeURIComponent(url.slice(index))
    event.respondWith(responseBlob(filename));
  } else {
    event.respondWith(cacheThenNetwork(event.request));
  }
});

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};


const registerNotification = async (key) => {
  console.log("Notification Registarion")
  try {
    const applicationServerKey = urlB64ToUint8Array(key);
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log(JSON.stringify(subscription))
  } catch (err) {
    console.log("Error", err);
  }
}