import { getValue } from "../../cache/cache.ts"
import {Renderer} from "../../components/renderer.ts"
import { LoadingSign } from "../../components/ui/loading-sign.ts"
import { BaseTestWindow } from "./base.ts"
import { convertOfflineTestToTuple } from "./helpers.ts"
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
    const publicBanks = getValue("public banks", false) || await window.test.names("public")

    const scheduled = await window.test.names("scheduled")
    const special = await window.test.names("special")
    const pastOfflineTests = await window.test.offline()
    const offlineTestNormalized = convertOfflineTestToTuple(pastOfflineTests,publicBanks)

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
      (new ListGenerator(
        "Past Offline Tests",
        offlineTestNormalized,
        [
          ["Continue","continue"],
          ["Delete","delete"]
        ]
      )).root
    )
  }
  start()
  
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  
}