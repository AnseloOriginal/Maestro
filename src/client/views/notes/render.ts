import {Renderer} from "../../components/renderer.ts"
import { LoadingSign } from "../../components/ui/loading-sign.ts"
import { pretify } from "./helpers.ts"
import { OfflineSection, generateRecentsButns } from "./generator.ts"
export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()
  container.append((new LoadingSign()).root)
  window.fs.recents().then(async recents => {
      recents.forEach((note,i,a) =>{
        a[i] = pretify(note)
      })
      const term = "firstterm" //This is a default value
      const notes = await window.fs.notes()
      container.innerHTML = "<h1> Notes </h1>"
      const openNote = async (note: string) => {
        await window.fs.open(note)
        const recentDiv = document.querySelector(".notes-recents")
        if (!recentDiv) {
          return
        }
        const recents = await window.fs.recents()
        recentDiv.replaceWith(generateRecentsButns(recents, openNote))
      }
      notes.forEach((note,i,a) =>{
        a[i] = pretify(note)
      })
      container.append(
        generateRecentsButns(recents, openNote),
        (new OfflineSection(notes, openNote)).root,
      )
  })
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  
}