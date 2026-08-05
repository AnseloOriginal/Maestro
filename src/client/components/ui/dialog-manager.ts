type renderFunction = (d: Dialog) => void

export class DialogManager {
  root = document.createElement("div")
  mainStack: Dialog[] = []

  constructor() {
    this.root.addEventListener("click", (evt) => this.onPointerClick(evt))
    this.root.style.zIndex = 1+""
    this.root.style.position = "fixed"
    this.root.style.width = "100vw"
    this.root.style.height = "100vh"
    this.active(false)
  }

  newDialog(
    render: renderFunction, 
    width: number = 200,
    height: number = 200,
  ) {
    const dialog = new Dialog(
      this.onPointerClick,
      this.onDialogClose,
      width,
      height,
      this.mainStack.length
    )
    this.root.append(dialog.root)
    this.mainStack.unshift(dialog)
    render(dialog)
    dialog.root.show()
    this.active(true)
  }

  onDialogClose = (dialog: Dialog) => {
    dialog.root.close()
    dialog.root.remove()
    const index = this.mainStack.findIndex((d) => {
      if (d === dialog) {
        return true
      }
    })
    if (index === -1) { return }
    console.warn("Dialog:",this.mainStack.splice(index,1))
    this.active(this.mainStack.length > 0)
  }

  onPointerClick = (evt: PointerEvent) => {
    if (!this.mainStack[0]) {
      return
    }
    const dialog = this.mainStack[0]
    const rect = dialog.root.getBoundingClientRect()
    const outOfBounds = 
      evt.clientY < rect.y ||
      evt.clientY > (rect.y + rect.height) ||
      evt.clientX < rect.x ||
      evt.clientX > (rect.x + rect.width)
    console.log(rect,outOfBounds,evt)
    if (this.mainStack[0] === dialog && outOfBounds) {
      this.onDialogClose(dialog)
    }
  }

  active(isTrue: boolean) {
    if (isTrue) {
      this.root.style.pointerEvents = "auto"
      this.root.style.backdropFilter = "blur(2px)"
    } else {
      this.root.style.pointerEvents = "none"
      this.root.style.backdropFilter = "none"
    }
  }
}

class Dialog {
  root = document.createElement("dialog")
  onClose: (d: Dialog) => void

  constructor(
    onClick: (evt: PointerEvent, d: Dialog) => void,
    onClose: (d: Dialog) => void,
    width: number,
    height: number,
    zindex: number
  ) {
    this.onClose = onClose
    this.root.style.minHeight = height+"px"
    this.root.style.minWidth = width+"px"
    this.root.style.zIndex = zindex+""
    this.root.style.position = "absolute"
    this.root.style.top = "50%"
    this.root.style.left = "50%"
    this.root.style.position = "absolute"
    this.root.style.transform = "translate(-50%, -50%)"

  }

  close() {
    this.onClose(this)
    this.root.close()
  }
}