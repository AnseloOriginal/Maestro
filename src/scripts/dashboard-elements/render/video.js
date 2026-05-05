export async function renderVideoLibrary(elem,data,onclick) {
  if (data.offline) {
    return
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
      imageElem.onclick = () => {
        if (onclick) {onclick(video)}
      }
      imageElem.src = await media.toImageURL(video.imageID)
      const videoTitle = document.createElement("p")
      videoTitle.classList.add("video-section-videotitle")
      videoTitle.innerText = video?.title || "No Title"
      videoDiv.append(imageElem,videoTitle)
      videoSectionDiv.append(videoDiv)
    }
    sectionDiv.append(videoSectionDiv)
    elem.append(sectionDiv)
  }
}

export async function createVideoPlayerElem(id,classes,downloads=true) {
  const videoElem = document.createElement("video")
  if (!downloads) {
    videoElem.setAttribute("controlsList","nodownload")
  }
  videoElem.innerHTML = `<source src="${await media.toVideoURL(id)}" type="video/mp4" />`
  videoElem.setAttribute("controls","")
  videoElem.autoplay = true
  videoElem.autofocus = true
  videoElem.classList.add(classes)
  return videoElem
}

export async function renderVideoPlayerPage(elem,videoData,backFunc) {
  const playingArea = document.createElement("div")
  playingArea.classList.add("main-video-playing-area")
  const mainVideo = await createVideoPlayerElem(videoData.videoID,"main-video-elem",videoData.downloads)
  const title = document.createElement("p")
  title.classList.add("main-video-playing-title")
  title.innerText = videoData?.title || "No Title"
  playingArea.append(mainVideo,title)
  elem.append(playingArea)
}