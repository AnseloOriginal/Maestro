import {Slider} from "./ui/slider.ts"
import {Renderer} from "./renderer.ts"
import {Session} from "./workers/session.ts"

export class App {
  root: HTMLElement
  renderer: Renderer
  session: Session

  constructor(root: HTMLElement) {
    console.log(root)
    this.root = root
    this.session = new Session()
    this.session.onStateChanged = this.StateChanged
    this.renderer = new Renderer(this)
    this.startUp()
  }

  startUp = async () => {
    //This will call StateChanged
    await this.session.firstTry()
    //In case state didn't change
    this.renderer.updateAlert()
    this.renderer.render("dashboard")
  }

  StateChanged = () => {
    this.renderer.updateAlert()
  }
}