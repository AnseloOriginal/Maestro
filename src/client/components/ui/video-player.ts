
export async function createVideoPlayer(id: string,externalClasses: string[],downloads=true) {
  const videoElem = document.createElement("video")
  if (!downloads) {
    videoElem.setAttribute("controlsList","nodownload")
  }
  videoElem.innerHTML = `<source src="${await window.media.toVideoURL(id)}" type="video/mp4" />`
  videoElem.setAttribute("controls","")
  videoElem.autoplay = true
  videoElem.autofocus = true
  externalClasses.forEach(c => videoElem.classList.add(c))
  return videoElem
}
