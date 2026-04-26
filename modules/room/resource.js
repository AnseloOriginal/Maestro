import * as video from "./../../src/scripts/dashboard-elements/render/video.js"
const body = document.getElementById("body")
const id = document.getElementById("demo1")
const type = document.getElementById("demo2")

const resID = res.id()
const resType =  res.type()

async function load() {
  body.innerHTML = ""
  if (resType === "picture") {
    const image = document.createElement("img")
    const url = await media.toImageURL(resID)
    image.src = url
    body.append(image)
  } else if (resType === "video") {
    const videoElem = await video.createVideoPlayerElem(resID)
    body.append(videoElem)
  }
}

load()