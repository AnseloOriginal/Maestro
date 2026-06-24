import {Slider} from "./ui/slider.ts"
import {Renderer} from "./renderer.ts"
export class App {
  root: HTMLElement
  renderer: Renderer

  constructor(root: HTMLElement) {
    console.log(root)
    this.root = root

    this.renderer = new Renderer(this)
    this.renderer.render("dashboard")
  }
}