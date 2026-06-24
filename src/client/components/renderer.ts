import {App} from "./main.ts";
import {ElementCreator} from "./ui/elements.ts"
import {render} from "./../views/dashboard/render.ts"
import {Slider} from "./ui/slider.ts"
type AvailableViews = "dashboard"

export class Renderer {
  app: App
  mainContainer: HTMLDivElement
  alertContainer: HTMLDivElement
  subContainer: HTMLDivElement
  elementCreator: ElementCreator
  slider: Slider

  registar = {
    "dashboard": render 
  }

  constructor(app:App) {
    this.app = app
    this.slider = new Slider()
    this.mainContainer = document.createElement("div")
    this.mainContainer.className = "content"
    this.alertContainer = document.createElement("div")
    this.alertContainer.className = "alert"
    this.subContainer = document.createElement("div")
    this.subContainer.className = "content2"
    this.mainContainer.append(this.subContainer)
    this.elementCreator = new ElementCreator()
    this._setup_slider()
    this.app.root.append(
      this.slider.container,
      this.mainContainer
    )
  }

  clearSubContainer() {
    this.subContainer.innerHTML = ""
  }

  render = (view: AvailableViews) => {
    this.registar[view](this,this.subContainer)
  }

  _setup_slider = () => {
    this.slider.addButton("dashboard","home",true,"Dashboard")
    .onclickEvent(() => this.render("dashboard"))
    this.slider.addButton("notes","book",true,"Notes")
    this.slider.addButton("tests","ink_pen",true,"Tests")
    this.slider.addButton("videos","video_library",true,"Videos")
  }
}