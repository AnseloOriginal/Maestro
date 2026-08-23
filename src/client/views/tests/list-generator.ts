import { BaseTestWindow } from "./base";

export type mainHandlerFunc = (type: string, uuid: string, listType: string, name: string) => void

export class ListGenerator extends BaseTestWindow {
  constructor(
    name: string,
    list: [string, string][],
    buttons: [string, string][],
    listType: "scheduled" | "special" | "offline",
    handleOnClick?: mainHandlerFunc
  ) {
    super(name)
    list.forEach(instance => {
      const name = instance[0]
      const id = instance[1]

      const line = document.createElement("p")
      const buttonContainer = document.createElement("div")

      line.innerHTML = `<span>${name}</span>`
      line.append(buttonContainer)
      this.body.append(line)

      buttons.forEach(buttonDef => {
        const button = document.createElement("button")
        button.innerText = buttonDef[0]
        button.onclick = () => this.handleOnClick(
          buttonDef[1],id,listType,name
        )
        buttonContainer.append(button)
      })

      line.classList.add("test-mainpage-line")
      if (handleOnClick) {
        this.handleOnClick = handleOnClick
      }
      
    })
  }

  handleOnClick = (type: string, uuid: string, listType: string, name: string) => {
    console.warn("No handler attached to list generator to handle:",type,uuid,listType)
  }
}