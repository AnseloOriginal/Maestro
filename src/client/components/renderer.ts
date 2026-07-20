import {App} from "./main.ts";
import {ElementCreator} from "./ui/elements.ts"
import {render} from "./../views/dashboard/render.ts"
import {Slider} from "./ui/slider.ts"
import { VIEWS, AvailableViews } from "../views/index.ts";

export class Renderer {
  app: App
  mainContainer: HTMLDivElement
  alertContainer: HTMLDivElement
  subContainer: HTMLDivElement
  elementCreator: ElementCreator
  slider: Slider
  currentView: AvailableViews

  constructor(app:App) {
    this.app = app
    this.slider = new Slider()
    this.mainContainer = document.createElement("div")
    this.mainContainer.className = "content"
    this.alertContainer = document.createElement("div")
    this.alertContainer.className = "alert"
    this.subContainer = document.createElement("div")
    this.subContainer.className = "content2"
    this.mainContainer.append(
      this.alertContainer,
      this.subContainer
    )
    this.elementCreator = new ElementCreator()
    this.#setup_slider()
    this.app.root.append(
      this.slider.container,
      this.mainContainer
    )
    this.currentView = "base" //This is so typescript would stop complaining
    this.render("base")
  }

  clearSubContainer() {
    this.subContainer.innerHTML = ""
  }

  render = (view: AvailableViews) => {
    VIEWS[view].render(this,this.subContainer)
    this.currentView = view
  }

  #setup_slider = () => {
    this.slider.addButton("dashboard","home",true,"Dashboard")
    .onclickEvent(() => this.render("dashboard"))
    this.slider.addButton("notes","book",true,"Notes")
    .onclickEvent(() => this.render("notes"))
    this.slider.addButton("tests","ink_pen",true,"Tests")
    this.slider.addButton("videos","video_library",true,"Videos")
  }

  updateAlert() {
    const isOnline = this.app.session.lastOnlineState
    const hasSession = this.app.session.lastSessionState
    const isVerified = this.app.validator.userinfo?.verified
    this.alertContainer.style.display = "block"
    if (!isOnline) {
      this.alertContainer.innerHTML = '<p class="alert-text">Offline Mode</p>'
    } else if (!hasSession) {
      this.alertContainer.innerHTML = '<p class="alert-text">No Session</p>'
    } else if (!isVerified) {
      this.alertContainer.innerHTML = '<p class="alert-text">Account not approved</p>'
    } else {
      this.alertContainer.style.display = "none"
    }
  }

  updateRendered() {
    VIEWS[this.currentView].update(this,this.subContainer)
  }
}