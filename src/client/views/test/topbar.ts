import { getValue } from "../../cache/cache";
import { TestManager } from "./manager";

export class TestTopbar {
  root = document.createElement("div")
  manager: TestManager
  lastTimeValue = 0
  constructor(
    manager: TestManager,
    enableCalculator: boolean
  ) {
    this.manager =  manager
    const userinfo = getValue("username",{username: "Unknown"})
    this.root.innerHTML = `
      <div class="test-interface-grid">
      <div class = "test-interface-userinfo-container">
        <div class = "test-interface-userinfo">
          <span class="test-interface-icon" title="user">account_circle</span>
          <p class="test-interface-user-name"> ${userinfo.username} </p>
        </div>
      </div>
      <div class="test-interface-usertools">
        ${
          enableCalculator ?
            `<button class="test-interface-butn test-interface-calculator">
              <span class="test-interface-icon button-icon" title="user">calculate</span>
            </button>` : ""
        }
        <button class="test-interface-butn test-interface-submit"> Submit </button> 
        <button class="test-interface-butn test-interface-abort"> Abort </button>
      </div>
      <div class="test-interface-time-container">
      <div class="test-interface-time">
        <p> - </p>:
        <p> - </p>:
        <p> - </p>
      </div>
      </div>
      <dialog class="test-interface-dialog">
        <button> SS </button>
      </dialog>
    </div>
  `
  this.root.querySelector(".test-interface-submit")
  ?.addEventListener("click", () => this.finishExam())
  this.root.querySelector(".test-interface-abort")
  ?.addEventListener("click", () => this.finishExam(true))

  }
  
  updateTime(duration: number) {
    this.lastTimeValue = duration
    const timeElem = this.root.querySelector(".test-interface-time")
    if (!timeElem) {
      return
    }
    timeElem.innerHTML = `
      <p> ${this.formatTime(duration,"hour")} </p>:
      <p> ${this.formatTime(duration,"minute")} </p>:
      <p> ${this.formatTime(duration,"second")} </p>
    `
  }

  formatTime = (
    duration: number,
    target: "second" | "minute" | "hour"
  ) => {
    let result = 0
    if (target === "second") {
      result = duration % 60
    } else if (target === "minute") {
      result = Math.floor(duration/60) % 60
    } else if (target === "hour") {
      result = Math.floor(duration / 3600)
    }
    if (result >= 10) {
      return result.toString()
    } else {
      return "0"+result //This is bad but needed
    }
  }

  finishExam(aborted: boolean = false) {
    this.manager.dialogManager.newDialog((dialog) => {
      
      const buttonClass = "test-topbar-button"
      dialog.root.innerHTML =  `
        <p>Are you sure you want to <b>${aborted ? "abort" : "submit"}?</b></p>
        <div class="button-cotainer">
          <button class="${buttonClass} ${buttonClass}-continue">${aborted ? "Submit" : "Abort"}</button>
          <button class="${buttonClass} ${buttonClass}-cancel">Cancel</button>
        </div>
      `
      dialog.root.querySelector(`.${buttonClass}-cancel`)?.addEventListener("click", () => dialog.close())
      dialog.root.querySelector(`.${buttonClass}-continue`)?.addEventListener("click", () => {
        dialog.close()
        this.manager.moveToUpload(aborted)
      })

    })
  }

  getTimeValue() {
    return `${this.formatTime(this.lastTimeValue,"hour")}h ${this.formatTime(this.lastTimeValue,"minute")}min ${this.formatTime(this.lastTimeValue,"second")}s`
  }
}