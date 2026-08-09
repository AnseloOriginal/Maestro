import { BaseTestWindow } from "./base";

export class ListGenerator extends BaseTestWindow {
  constructor(
    name: string,
    list: [string, string][],
    buttons: [string, string][],
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
        buttonContainer.append(button)
      })

      line.classList.add("test-mainpage-line")
      
    })
  }
}