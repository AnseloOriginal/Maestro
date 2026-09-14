import {Renderer} from "../../components/renderer.ts"
import { MessageDisplay } from "../../components/ui/message.ts"
import { TestManager } from "./manager.ts"

export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()
  const manager = new TestManager(
    renderer
  )

  manager.onFatalError = (error) => {
    manager.root.innerHTML = ""
    manager.root.append(
      (new MessageDisplay("error",error)).root
    )
    manager.exit()
  }
  
  container.append(manager.root)
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  
}