import {Slider} from "./ui/slider.ts"
export class App {
  root: HTMLElement
  slider: Slider

  constructor(root: HTMLElement) {
    console.log(root)
    this.root = root
    this.slider = new Slider()
    this.slider.addButton("dashboard","home",true,"Dashboard")
    this.slider.addButton("notes","book",true,"Notes")
    this.slider.addButton("tests","ink_pen",true,"Tests")
    this.slider.addButton("videos","video_library",true,"Videos")
    this.root.append(this.slider.container)
  }
}