import { IconButn } from "../../components/ui/buttons"
import { extractSubjectName } from "./helpers"

type butnOnClickHandler = (name: string) => void

const butnOnClick = (evt: PointerEvent, handler: butnOnClickHandler) => {
      if (evt.target instanceof HTMLElement) {
        const button = evt.target.closest(".notes-button")
        const content = button?.getAttribute("content")
        if (!content) {
          return
        }
        handler(content)
      }
}
export function generateRecentsButns(rarray: string[], onclick: butnOnClickHandler) {
  const recents = document.createElement("div")
  recents.classList.add("notes-recents")
  recents.id = "recents"
  recents.innerHTML = '<h3 class="notes-recent-header" > Recents </h3>'
  recents.onclick = (evt) => butnOnClick(evt,onclick)
  if (rarray.length > 0) {
    rarray.forEach(recent => {
      const newbutton = new IconButn(recent,"notes-button","notes-button-text","file_open").root
      newbutton.setAttribute("name","notes-recents-button")
      newbutton.setAttribute("content",recent.toLowerCase())
      recents.append(newbutton)
    });
  } else {
    recents.innerHTML = recents.innerHTML + '<p class="recents-no-notes"> Recently Opened notes will appear here </p>'
  }
  return recents
}

export class OfflineSection {

  root = document.createElement("div")
  suggestions = ""
  termSelector: HTMLSelectElement
  butnArea = document.createElement("div")
  searchBar: HTMLInputElement

  constructor(notes: string[], onclick: butnOnClickHandler) {
    this.buildSuggestions(notes)
    this.root.setAttribute("class","notes-offline")
    this.root.innerHTML = 
    `<h3 class="notes-offline-header"> Offline </h3> 
    <div class="notes-offline-options"> 
      <datalist id="gensubject"> 
        ${this.suggestions}
      </datalist>
      <select class="notes-offline-select-term">
        <option value="firstterm">First Term</option>
        <option value="secondterm">Second Term</option>
        <option value="thirdterm">Third Term</option> 
      </select>
      <input type="search" class="notes-offline-options-sort" list="gensubject" placeholder="Search Notes" inputmode="search">
      <button class="notes-offline-options-online notes-classic-button"> Browse Online Notes </button>
    </div>`
    this.termSelector = this.root.querySelector(".notes-offline-select-term") as HTMLSelectElement
    this.searchBar = this.root.querySelector(".notes-offline-options-sort") as HTMLInputElement
    this.termSelector.onchange = this.sort
    this.searchBar.oninput = this.sort

    this.butnArea.onclick = (evt) => butnOnClick(evt,onclick)
    this.butnArea.setAttribute("class","offline-butn-group")
    if (notes.length > 0) {
      notes.forEach(note => {
        const lowerCase1 = note.toLowerCase()
        const lowerCase2 = ""
        if (lowerCase1.includes(lowerCase2)){
          note = note.replace("firstterm","")
          note = note.replace("thirdterm","")
          note = note.replace("secondterm","")
          console.log(note)
          const newbutton = new IconButn(note,"notes-button","notes-button-text","file_open").root
          newbutton.setAttribute("content",lowerCase1)
          newbutton.setAttribute("name","notes-offline-open-note")
          this.butnArea.append(newbutton)
        }
      });
    } else {
      this.root.innerHTML = this.root.innerHTML + '<p class="offline-no-notes"> No offline notes available here </p>'
    }
    this.root.append(this.butnArea)
  }

  buildSuggestions(notes: string[]) {
    this.suggestions = ""
    const subjectsOnly = extractSubjectName(notes)
    subjectsOnly.forEach( subject => {
      this.suggestions = this.suggestions + `<option value="${subject}"></option>`
    })
  }

  sort = () => {
    const allButtons = document.getElementsByName("notes-offline-open-note")
    const term = this.termSelector.value.toLowerCase()
    const keywords = this.searchBar.value
    console.log("Sorting",term,keywords)
    allButtons.forEach(button => {
      const content = button.getAttribute("content")
      if (!content) {
        return
      }
      if (content.includes(term) && content.includes(keywords)) {
        button.style.display = "inline"
      } else {
        button.style.display = "none"
      }
    });
    }
}