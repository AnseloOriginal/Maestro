import {Slider} from "./ui/slider.ts"
import {Renderer} from "./renderer.ts"
import {Session} from "./workers/session.ts"
import { Validator } from "./workers/validator.ts"
import { listenToElectron } from "../events/listenToElectron.ts"

export class App {
  root: HTMLElement
  renderer: Renderer
  session: Session
  validator: Validator

  constructor(root: HTMLElement) {
    console.log(root)
    this.root = root
    listenToElectron()
    this.session = new Session()
    this.session.onStateChanged = this.StateChanged
    this.renderer = new Renderer(this)
    this.startUp()
    this.validator = new Validator()
  }

  startUp = async () => {
    //This will call StateChanged
    await this.session.firstTry()
    //In case state didn't change
    await this.validator.validate()
    this.renderer.updateAlert()
    this.renderer.render("dashboard")
  }

  StateChanged = async () => {
    await this.validator.validate()
    this.renderer.updateAlert()
    this.renderer.updateRendered()
  }
}