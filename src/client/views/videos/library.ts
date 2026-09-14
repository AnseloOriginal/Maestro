import { MediaLibrary, MediaVideo } from "../../.."
import { updateValue } from "../../cache/cache"
import { Renderer } from "../../components/renderer"
import { LoadingSign } from "../../components/ui/loading-sign"
import { MessageDisplay } from "../../components/ui/message"

export class VideoLibrary {

  root = document.createElement("div")
  renderer: Renderer
  constructor(renderer: Renderer) {
    this.renderer = renderer
  }

  update = async () => {
    this.clear(true)
    const data = await window.media.library()
    this.renderVideoLibrary(data)
  }

  clear(showLoading?: boolean) {
    this.root.innerHTML = ""
    if (!showLoading) {
      return
    }
    const loadingSign = new LoadingSign()
    this.root.append(loadingSign.root)
  }

  renderVideoLibrary = async (data: MediaLibrary) => {
    this.root.innerHTML = ""
    if (data.offline) {
      (new MessageDisplay("offline","Seems you aren't connected")).root
    }

    for(let s = 0;s<data.content.length;s++) {
      const section = data.content[s]
      const sectionDiv = document.createElement("div")
      sectionDiv.classList.add("video-section-container")
      const sectionTitle = document.createElement("p")
      sectionTitle.classList.add("video-section-title")
      sectionTitle.innerText = section?.title || "Video Group"
      sectionDiv.append(sectionTitle)
      const videoSectionDiv = document.createElement("div")
      videoSectionDiv.classList.add("video-section-vidoescontainer")
      for(let v = 0;v<section.group.length;v++) {
        const video = section.group[v]
        const videoDiv = document.createElement("div")
        videoDiv.classList.add("video-section-video")
        const imageElem = document.createElement("img")
        imageElem.classList.add("video-section-videoimg")
        imageElem.onclick = () => this.openVideo(video)
        imageElem.src = await window.media.toImageURL(video.imageID)
        const videoTitle = document.createElement("p")
        videoTitle.classList.add("video-section-videotitle")
        videoTitle.innerText = video?.title || "No Title"
        videoDiv.append(imageElem,videoTitle)
        videoSectionDiv.append(videoDiv)
      }
      sectionDiv.append(videoSectionDiv)
      this.root.append(sectionDiv)
    }  
  }

  openVideo(video: MediaVideo) {
    updateValue("target video",video)
    this.renderer.render("video-player")
  }
}
