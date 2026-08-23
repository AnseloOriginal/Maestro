import { getValue, updateValue } from "../../cache/cache.ts"
import {Renderer} from "../../components/renderer.ts"
import { LoadingSign } from "../../components/ui/loading-sign.ts"
import { showAndHide } from "../notes/helpers.ts"
import { initialRendering, preSelection as preStartRendering} from "./testpage.ts"

export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()

  const maincontainer = document.createElement("div")
  maincontainer.classList.add("test-mainpage-maincontainer")
  maincontainer.append(
    (new LoadingSign).root
  )
  const preStartContainer = document.createElement("div")
  
  const handleOnClick = (type: string, uuid: string, listType: string, name: string) => {
    if (type === "start") {
      preStartRendering(preStartContainer,uuid,listType,name,handleOnClick)
      showAndHide(preStartContainer,maincontainer)
    } else if (type === "cancel") {
      showAndHide(maincontainer,preStartContainer)
    } else if (type === "mainstart") {
      updateValue("target-test",{
        type: listType,
        uuid,
        isOffline: false
      })
      renderer.render("test")
    }
  }
  initialRendering(maincontainer,handleOnClick)
  container.append(maincontainer,preStartContainer)  
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  
}