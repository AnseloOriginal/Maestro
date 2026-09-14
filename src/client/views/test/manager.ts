import {Renderer} from "../../components/renderer.ts"
import { TestDetails, TestQuestion, TestQuestions } from "../../.."
import { getValue } from "../../cache/cache"
import { DialogManager } from "../../components/ui/dialog-manager"
import { LoadingSign } from "../../components/ui/loading-sign"
import { countQuestions } from "./interface/helper"
import { TestInterface } from "./interface/test-interface"
import { TestTopbar } from "./topbar"
import { TestUploader, TestUploaderProgress } from "./interface/test-uploader.ts"

export class TestManager {
  testUuid: string = ""
  testType: string = ""
  testDetails: TestDetails | null = null
  testInterface: TestInterface | null = null
  testQuestions: TestQuestions | null = null
  topBar: TestTopbar | null = null
  loopID = 0
  timeElasped = 0
  firstTimeStamp = 0
  lastServerSyncUpdateTimestamp = 0
  root = document.createElement("div")
  dialogManager = new DialogManager()
  renderer: Renderer
  cancelledTimer = false

  constructor(
    renderer: Renderer
  ) {
    this.renderer = renderer
    this.root.append((new LoadingSign()).root)
    const targetTest = getValue("target-test",null)
    if (!targetTest) {
      this.onFatalError("Couldn't find test to start.")
      return
    }
    this.testType = targetTest.type
    this.testUuid = targetTest.uuid
    this.loadAndStart()
  }

  loadAndStart = async () => {
    const details = await window.test.details(this.testUuid,this.testType)
    
    const timeFromServer: number = Number(await window.test.variable("get",this.testUuid,"elasped",null,this.testType))
    console.log("Elasped time is",timeFromServer)
    if (!(details?.duration)) {
      this.onFatalError("Missing information to start")
      return
    }
    const questionsOrError = await window.test.questions(this.testUuid,this.testType)
    if (typeof questionsOrError === "string") {
      this.showCompletionScreen(questionsOrError)
      return
    }
    if (!questionsOrError || Object.entries(questionsOrError).length === 0 || countQuestions(questionsOrError) === 0) {
      this.onFatalError("No Test Questions")
      return
    }
    this.ready(details,questionsOrError,timeFromServer)
  }

  ready = (details: TestDetails, questions: TestQuestions, timeFromServer: number) => {
    this.renderer.setAppMode("focused")
    this.testDetails = details
    this.testQuestions = questions
    this.timer(performance.now(),true,timeFromServer)

    this.root.innerHTML = ""
    this.topBar = new TestTopbar(this,details?.calculator || false)
    this.testInterface = new TestInterface(this.testType,this.testUuid,questions)
    this.root.append(this.dialogManager.root,this.topBar.root,this.testInterface.root)
  }

  onFatalError = (error: string) => {
    console.warn("No fatal error handler for:",error)
    this.exit()
  }

  exit() {
    this.cancelTimer()
    this.renderer.setAppMode("normal")
  }

  cancelTimer() {
    cancelAnimationFrame(this.loopID)
    this.cancelledTimer = true
  }

  timer = (timestamp: number, start?: boolean, offsetSec: number = 0) => {
    if (this.cancelledTimer) {
      return
    }
    if (start) {
      this.firstTimeStamp = timestamp - (offsetSec*1000)
      this.lastServerSyncUpdateTimestamp = this.firstTimeStamp
      this.timeElasped = 0
    }
  
    const elasped = timestamp - this.firstTimeStamp
    this.timeElasped = Math.floor(elasped / 1000)
    this.handleTimeUpdate(timestamp)
    
    this.loopID = requestAnimationFrame(this.timer)
  }

  handleTimeUpdate(timestamp: number) {
    if ((timestamp - this.lastServerSyncUpdateTimestamp) > 5000) {
      window.test.variable("set",this.testUuid,"elasped",this.timeElasped,this.testType)
      this.lastServerSyncUpdateTimestamp = timestamp
    }
    const duration = this.testDetails?.duration
    if (duration && this.timeElasped >= duration) {
      this.moveToUpload(false)
      // console.log(duration,t)
    }
    this?.topBar?.updateTime(this.timeElasped)
  }

  moveToUpload(aborted: boolean) {
    if (!this.testQuestions) {
      //Very unlikely due to the fact that testQuestions is needed to get here
      this.onFatalError("Questions are not there to send")
      return
    }
    this.root.innerHTML = ""
    this.cancelTimer()
    const testUploader = new TestUploader(this.testUuid,this.testType,aborted,this.testQuestions)
    const testUploadProgress = new TestUploaderProgress(testUploader,this.uploadComplete)
    this.root.append(testUploadProgress.root)
    testUploader.start()
  }

  uploadComplete = () => {
    this.root.innerHTML = `
      <div>
        <div class="focus-icon-container">
          <span class="material-symbols-outlined">task_alt</span>
        </div>
        <p> You're done </p>
        <p> You spent ${this?.topBar?.getTimeValue() || "O seconds"} seconds</p>
      </div>
    `
    this.root.append(this.getAfterTestTools())
    this.exit()
  }

  showCompletionScreen = (reason: string) => {
    this.root.innerHTML = `
      <div>
        <div class="focus-icon-container">
          <span class="material-symbols-outlined">lock</span>
        </div>
        <p> You have already completed this exam. </p>
        <p> REASON: ${reason} </p>
      </div>
    `
    this.root.append(this.getAfterTestTools())
    this.exit()
  }

  getAfterTestTools() {
    const extra = document.createElement("div")
    extra.classList.add('button-cotainer')
    const button1 = document.createElement("button")
    button1.innerText = "Show Result"
    button1.onclick = () => window.test.displayResult(this.testUuid,this.testType,"Examss")
    extra.append(button1)
    return extra
  }
}