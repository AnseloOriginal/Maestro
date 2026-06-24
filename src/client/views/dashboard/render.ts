import {Renderer} from "./../../components/renderer.ts"

export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()
  container.innerHTML = `
    <h1> Worker Dashboard</h1>
    <p> Use this app to access notes and monitor students<p>
    `
}