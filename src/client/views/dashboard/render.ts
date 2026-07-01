import {Renderer} from "./../../components/renderer.ts"

export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()
  // renderer.app.
  container.innerHTML = `
    <h1 class="dashboard-title"> Worker Dashboard</h1>
    <p class="dashboard-title"> Use this app to access notes and monitor students<p>
    `
}

export function update(renderer: Renderer) {

}