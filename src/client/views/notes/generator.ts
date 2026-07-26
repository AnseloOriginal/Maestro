import { IconButn } from "../../components/ui/buttons"
import { LoadingSign } from "../../components/ui/loading-sign"
import { addOptions, extractSubjectName, getOnlineNotes, pretify } from "./helpers"

const classes = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"]
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
    this.root.querySelector(".notes-offline-options-online")?.addEventListener("click", () => {
      this.toOnlineSection()
    })

    this.butnArea.onclick = (evt) => butnOnClick(evt,onclick)
    this.butnArea.classList.add("offline-butn-group")
    this.renderButns(notes)
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
    const keywords = this.searchBar.value.toLowerCase()
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

  update  = async () => {
    const notes = await window.fs.notes()
    notes.forEach((note,i,a) =>{
      a[i] = pretify(note)
    })
    this.renderButns(notes)
  }

  toOnlineSection = () => {
    console.warn("No handler for going to online section")
  }
  renderButns = (notes: string[]) => {
    this.butnArea.innerHTML = ""
    if (notes.length === 0) {
      this.root.innerHTML = this.root.innerHTML + '<p class="offline-no-notes"> No offline notes available here </p>'
      return
    }
    notes.forEach(note => {
      let displayName = note
      displayName = displayName.replace("firstterm","")
      displayName = displayName.replace("thirdterm","")
      displayName = displayName.replace("secondterm","")
      const newbutton = new IconButn(displayName,"notes-button","notes-button-text","file_open").root
      newbutton.setAttribute("content",note.toLowerCase())
      newbutton.setAttribute("name","notes-offline-open-note")
      this.butnArea.append(newbutton)
    });
  }
}


export class OnlineSection {
  root = document.createElement("div")
  termSelector = document.createElement("select")
  classSelector = document.createElement("select")
  butnArea = document.createElement("div")
  searchBar = document.createElement("input")

  constructor() {
    this.root.innerHTML = `
      <button class="notes-online-back notes-classic-button"> Back </button>
      <h1> School Notes </h1>
    `
    this.root.classList.add("notes-online")
    const controlContainer = document.createElement("div")
    controlContainer.classList.add("notes-online-control-group")
    this.classSelector.classList.add("notes-online-sorter")
    this.termSelector.classList.add("notes-online-term-sorter")
    this.searchBar.classList.add("notes-online-text-sorter")
    this.searchBar.placeholder = "Search Notes"

    this.termSelector.innerHTML = `
      <option value="firstterm">First Term</option>
      <option value="secondterm">Second Term</option>
      <option value="thirdterm">Third Term</option>
    `
    this.classSelector.innerHTML =  `
      <option value="">All</option>
    `
    addOptions(this.classSelector,...classes)
    
    controlContainer.append(
      this.termSelector,
      this.classSelector,
      this.searchBar
    )
    this.root.append(
      controlContainer,
      this.butnArea
    )
    this.searchBar.oninput = () => this.sort()
    this.termSelector.onchange = () => this.sort()
    this.classSelector.onchange = () => this.sort()
    
  }

  async update() {
    this.butnArea.append(
      (new LoadingSign).root
    )
    const notes = [
      ...(await getOnlineNotes("firstterm")).notes,
      ...(await getOnlineNotes("secondterm")).notes,
      ...(await getOnlineNotes("thirdterm")).notes
    ]
    this.butnArea.innerHTML = ""
    notes.forEach(note => {
        let displayName = note.replace("firstterm","")
        displayName = displayName.replace("secondterm","")
        displayName = displayName.replace("thirdterm","")
        displayName = pretify(displayName)
        const newbutton = new IconButn(displayName,"notes-button","notes-button-text","file_download").root   
        newbutton.classList.add("notes-online-butn")
        newbutton.setAttribute("content",note)
        newbutton.setAttribute("name","notes-online-download-note")
        this.butnArea.append(newbutton)
    })
    this.sort()
  }

  sort = () => {
    const term = this.termSelector.value.toLowerCase()
    const curClass = this.classSelector.value.toLowerCase()
    const search = this.searchBar.value.toLowerCase()
    const butns = this.butnArea.querySelectorAll(".notes-online-butn")
    butns.forEach(butnElem => {
      const butn = butnElem as HTMLButtonElement
      const value = butn.getAttribute("content")?.toLowerCase()
      if (!value) {
        return
      }
      if (value.includes(term) && value.includes(curClass) && value.includes(search)) {
        butn.style.display = ""
      } else {
        butn.style.display = "none"
      }
    })
  }

}