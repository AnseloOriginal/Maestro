import {Renderer} from "../../components/renderer.ts"
import { LoadingSign } from "../../components/ui/loading-sign.ts"
import { pretify, pretifyAll, showAndHide } from "./helpers.ts"
import { OfflineSection, OnlineSection, generateRecentsButns } from "./generator.ts"
export function render(renderer: Renderer, container: HTMLDivElement) {
  renderer.clearSubContainer()
  container.append((new LoadingSign()).root)

  const offlineNotes  = document.createElement("div")
  const onlineNotes  = document.createElement("div")
  onlineNotes.style.display  = "none"

  window.fs.recents().then(async recents => {
      recents = pretifyAll(recents)
      const notes = pretifyAll(
        await window.fs.notes()
      )
      console.log(notes)

      container.innerHTML = ""
      offlineNotes.innerHTML = "<h1> Notes </h1>"
      container.append(offlineNotes,onlineNotes)

      const onOpenNote = async (note: string) => {
        await window.fs.open(note)
        const recentDiv = document.querySelector(".notes-recents")
        if (!recentDiv) {
          return
        }
        const recents = await window.fs.recents()
        recentDiv.replaceWith(generateRecentsButns(recents, onOpenNote))
      }
    
      const offlineSection = new OfflineSection(notes, onOpenNote)
      const onlineSection = new OnlineSection()
      renderer.addEventHandler(
        "app-download-info", 
        info => onlineSection.onDownloadComplete(info)
      )
      onlineNotes.append(onlineSection.root)

      offlineNotes.append(
        generateRecentsButns(recents, onOpenNote),
        offlineSection.root,
      )

      const toOnlineNote = () => {
        onlineSection.update()
        showAndHide(onlineNotes,offlineNotes)  
      }

      const toOfflineNote = () => {
        showAndHide(offlineNotes,onlineNotes)
        offlineSection.update()
      }

      offlineSection.toOnlineSection = toOnlineNote
  })
}

export function update(renderer: Renderer, container: HTMLDivElement) {
  
}

