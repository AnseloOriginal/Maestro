import { getValue } from "../../cache/cache.ts"
import {Renderer} from "../../components/renderer.ts"
import { LoadingSign } from "../../components/ui/loading-sign.ts"
import { BaseTestWindow } from "./base.ts"
import { ListGenerator } from "./list-generator.ts"

export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()

  const maincontainer = document.createElement("div")
  maincontainer.classList.add("test-mainpage-maincontainer")
  maincontainer.append(
    (new LoadingSign).root
  )
  container.append(maincontainer)

  const start = async () => {

    const scheduled = await window.test.names("scheduled")
    const special = await window.test.names("special")

    maincontainer.innerHTML = ""
    maincontainer.append(
      (new ListGenerator(
        "Planned Exams",
        scheduled,
        [["Start","start"]]
      )).root,
      (new BaseTestWindow("B")).root,
      (new ListGenerator(
        "Special Exams",
        special,
        [["Start","start"]]
      )).root,
      (new BaseTestWindow("D")).root
    )
  }
  start()
  
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  
}