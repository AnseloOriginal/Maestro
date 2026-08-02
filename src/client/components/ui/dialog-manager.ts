type renderFunction = (d: Dialog) => void

export class DialogManager {
  root = document.createElement("div")
  mainStack: Dialog[] = []

  constructor() {
    this.root.addEventListener("click", (evt) => this.onPointerClick(evt))
  }

  newDialog(render: renderFunction) {
    const dialog = new Dialog(
      this.onPointerClick,
      this.onDialogClose
    )
    this.root.append(dialog.root)
    this.mainStack.unshift(dialog)
    render(dialog)
    dialog.root.show()
  }

  onDialogClose = (dialog: Dialog) => {
    dialog.root.close()
    const index = this.mainStack.findIndex((d) => {
      if (d === dialog) {
        return true
      }
    })
    if (index === -1) { return }
    console.warn("Dialog:",this.mainStack.splice(index,1))
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
}

class Dialog {
  root = document.createElement("dialog")
  onClose: (d: Dialog) => void

  constructor(
    onClick: (evt: PointerEvent, d: Dialog) => void,
    onClose: (d: Dialog) => void
  ) {
    this.onClose = onClose
  }

  close() {
    this.onClose(this)
    this.root.close()
  }
}