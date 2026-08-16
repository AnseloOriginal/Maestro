import { getValue } from "../../cache/cache.ts"
import {Renderer} from "../../components/renderer.ts"
import { createVideoPlayer } from "../../components/ui/video-player.ts"

export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()
  const videoData = getValue("target video",false)
  if (!videoData) {
    return
  }
  const playingArea = document.createElement("div")
  playingArea.classList.add("main-video-playing-area")
  createVideoPlayer(videoData.videoID,["main-video-elem"],videoData.downloads).then(mainVideo => {
    const title = document.createElement("p")
    title.classList.add("main-video-playing-title")
    title.innerText = videoData?.title || "No Title"
    playingArea.append(mainVideo,title)
    if (videoData.source) {
      const source = document.createElement("div")
      source.innerHTML = `<b>Source:<b> ${videoData.source}`
      playingArea.append(source)
    }
    container.append(playingArea)
  })
  
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  render(renderer,container) 
}