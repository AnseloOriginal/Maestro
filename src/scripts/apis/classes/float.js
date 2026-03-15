export class FloatableDiv {

  #lastDragX = 0
  #lastDragY = 0
  constructor(x=0,y=0,allowFloating=true) {
    const div = document.createElement("div")
    div.style.position = "absolute"
    div.draggable = true
    this.x = x
    this.y = y
    div.style.top =  `${this.y}px`
    div.style.left =  `${this.x}px`

    div.ondragstart = (evt) => {
      this.#lastDragX = evt.x
      this.#lastDragY = evt.y
    }

    div.ondragend = (evt) => {
      const diffX = evt.x - this.#lastDragX
      const diffY = evt.y - this.#lastDragY
      this.x += diffX
      this.y += diffY
      div.style.top =  `${this.y}px`
      div.style.left =  `${this.x}px`
      console.log(`"Moved from (${this.#lastDragX},${this.#lastDragY}) to 
        (${evt.x},${evt.y}) with diff (${diffX},${diffY}). New coordinates are 
        (${this.x},${this.y}) and style is (${div.style.top},${div.style.bottom})`)
    }

    this.objectDiv = div
  }
}