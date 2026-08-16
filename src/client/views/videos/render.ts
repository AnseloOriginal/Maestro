import {Renderer} from "../../components/renderer.ts"
import { LoadingSign } from "../../components/ui/loading-sign.ts"
import { VideoLibrary } from "./library.ts"

export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()
  const library = new VideoLibrary(renderer)
  container.append(library.root)
  library.update()
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  
}