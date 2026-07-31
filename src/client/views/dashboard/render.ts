import {Renderer} from "./../../components/renderer.ts"
import { DashboardWidgets } from "./widgets.ts"

export function render(renderer: Renderer, container: HTMLDivElement, updateCall?: boolean) {
  renderer.clearSubContainer()
  const type = renderer.app.validator.accessLevel() ? "Worker" : "Student"
  const extra = renderer.app.validator.accessLevel() ? "and monitor students" : ""
  container.innerHTML = `
    <h1 class="dashboard-title"> ${type} Dashboard</h1>
    <p class="dashboard-title"> Use this app to access notes ${extra}<p>
    `
  // if (updateCall) {
  //   return
  // }
  
  const widgetLine = new DashboardWidgets()
  container.append(widgetLine.root)
  console.log(widgetLine)
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  //Due to the likeness of Dashboard update to render, we'll just call it
  render(renderer, container, true)
}