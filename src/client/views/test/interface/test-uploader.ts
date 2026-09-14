import { string } from "zod";
import { TestQuestions } from "../../../..";
import { convertToNumber, countQuestions } from "./helper";

type onUpdateFunc = (
  process: "start" | "upload" | "submit" | "finish",
  type: "progress" | "done",
  progress?: number
) => void

export class TestUploader {
  uuid: string
  type: string
  aborted: boolean
  data: TestQuestions
  
  constructor(
    uuid: string,
    type: string,
    aborted: boolean,
    data: TestQuestions
  ) {
    this.uuid = uuid
    this.type = type
    this.aborted = aborted
    this.data = data

  }

  async start() {
    this.onUpdate("start","done")
    
    const totalCount = countQuestions(this.data)
    
    this.onUpdate("upload","progress",0)
    let tryAgain = true
    let retryCount = 0
    while (tryAgain) {
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      tryAgain = !(await window.test.upload(this.uuid,this.data))
      this.onUpdate("upload","progress",retryCount)
      retryCount++
    }
    this.onUpdate("upload","done")
    
    let hasSubmitted = false
    while(!hasSubmitted && !this.aborted) {
      hasSubmitted = await window.test.submit(this.uuid,this.type)
    }
    this.onUpdate("submit","done")

    this.onUpdate("finish","done")

  }

  onUpdate: onUpdateFunc = (process,type,progress) => {}
}

export class TestUploaderProgress {

  root = document.createElement("div")
  onCompletion: () => void
  constructor(
    uploader: TestUploader,
    onCompletion: () => void
  ) {
    uploader.onUpdate = this.manageTestUpdate
    this.initialRender(uploader.aborted)
    this.onCompletion = onCompletion
  }

  initialRender(aborted: boolean) {
    this.root.innerHTML = `
      <p>Do not close the app</p>
      <p>We're uploading your results</p>
      <div>
        ${createUploadStage("start","Starting upload")}
        ${createUploadStage("upload","Uploading result")}
        ${
          aborted ? "" : createUploadStage("submit","Sumbitting your exam")
        }
        ${createUploadStage("finish","Finishing up")}
      </div>
    `
  }

  manageTestUpdate: onUpdateFunc = (process,type,progress) => {
    if (type === "done") {
      markAsDone(this.root,process)
    } else if (type === "progress" && progress) {
      updateProgress(this.root,process,progress)
    }
    if (type === "done" && process === "finish") {
      setTimeout(() => this.onCompletion(), 500) 
    }
  }

}

function createUploadStage(
  id: string,
  text: string
) {
  return `
  <div class="test-upload-stage">
    <span class="material-symbols-outlined upload-stage-icon upload-stage-icon-${id}">circle</span>
    <p class="upload-stage-text upload-stage-text-${id}">${text}</p>
  </div>
  `
}

function markAsDone(elem: HTMLElement, id: string) {
  const icon = elem.querySelector(`.upload-stage-icon-${id}`)
  const text = elem.querySelector(`.upload-stage-text-${id}`)
  if (!icon || !text) {
    return
  }
  icon.innerHTML = "check"
  text.innerHTML = updateProgressInText(text.innerHTML,null)
}

function updateProgress(elem: HTMLElement, id: string, progress: number) {
  const text = elem.querySelector(`.upload-stage-text-${id}`)
  if (!text) {
    return
  }
  text.innerHTML = updateProgressInText(text.innerHTML,progress+"%")
}

function updateProgressInText(text: string, progress: string | null) {
  
  if (progress) {
    const newText = text.replaceAll(/(?<=\()[^)]+(?=\))/g, progress)
    if (newText === text) {
      return `${text} (${progress})`
    }
    return newText
  } else {
    return text.replace( /\([^)]+\)/g, "")
  }
}

