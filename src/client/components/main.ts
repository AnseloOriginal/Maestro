import {Renderer} from "./renderer.ts"
import {Session} from "./workers/session.ts"
import { Validator } from "./workers/validator.ts"
import { listenToElectron } from "../events/listenToElectron.ts"
import { getValue, updateValue } from "../cache/cache.ts"
import { sendEvent } from "../events/send.ts"

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
    this.checkForUpdates()
    this.renderer.render("dashboard")
  }

  StateChanged = async () => {
    await this.validator.validate()
    this.renderer.updateAlert()
    this.renderer.updateRendered()
  }

  checkForUpdates = async () => {
    const lastVersion = getValue("version","0.0.0")
    const currentVersion = await window.sys.appVersion()
    if (lastVersion == currentVersion) {
      return
    }
    sendEvent("update-event",{
      oldVersion: lastVersion,
      newVersion: currentVersion
    })
    updateValue("version",currentVersion)
  }
}