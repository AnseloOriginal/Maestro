import { IconButn } from "../../components/ui/buttons"




function attachHooks(hook,section,supersort) {
 const offlineSearchButton = document.querySelector(".notes-offline-options-sort")
 const offlineBrowseButton = document.querySelector(".notes-offline-options-online")
 const onlineSorter = document.querySelector(".notes-online-sorter")
 const onlineBack = document.querySelector(".notes-online-back")
 const onlineTextSorter = document.querySelector(".notes-online-text-sorter")
 const onlineTermSelector = document.querySelector(".notes-online-term-sorter")
 const downloadNoteButton = document.getElementsByName("notes-online-download-note")
 const openButton = document.getElementsByName("notes-offline-open-note")
 const recentsButton = document.getElementsByName("notes-recents-button")
 const offlineSelectTermButton = document.querySelector(".notes-offline-select-term")
 
 if (offlineSelectTermButton) {
    if (supersort === "firstterm") {
      offlineSelectTermButton.selectedIndex = 0
    } else if (supersort === "secondterm") {
      offlineSelectTermButton.selectedIndex = 1
    } else if (supersort === "thirdterm") {
      offlineSelectTermButton.selectedIndex = 2
    }
  offlineSelectTermButton.addEventListener("change",evt => {
    const supersort = evt.target.value
    const extraSearch = offlineSearchButton?.value
    if (extraSearch) {
      regenerate_offline_notes(supersort+" "+extraSearch) 
    } else {
      regenerate_offline_notes(supersort)
    }
  })
 }

 if (offlineSearchButton) {
  offlineSearchButton.oninput = () => {
    const extraSearch = offlineSelectTermButton ? offlineSelectTermButton.value + " ": ""
    regenerate_offline_notes(extraSearch + offlineSearchButton.value)
  }
 }

 if (onlineTermSelector) {
    if (supersort === "firstterm") {
      onlineTermSelector.selectedIndex = 0
    } else if (supersort === "secondterm") {
      onlineTermSelector.selectedIndex = 1
    } else if (supersort === "thirdterm") {
      onlineTermSelector.selectedIndex = 2
    }
    onlineTermSelector.addEventListener("change",evt => {
      const supersort = evt.target.value
      const extraSearch1 = onlineSorter ? " " + onlineSorter.value : "" //same as offlineSearchButton
      const extraSearch2 = onlineTextSorter ? " " + onlineTextSorter.value : "" //same as offlineSearchButton
      const sortstring = supersort+extraSearch1+extraSearch2
      regenerate_online_notes(sortstring)
      console.log(sortstring)
    })
 }

  if (onlineTextSorter) {
    onlineTextSorter.oninput = () => {
      const supersort = onlineTermSelector.value
      const extraSearch1 = onlineSorter ? " " + onlineSorter.value : "" //same as offlineSearchButton
      const extraSearch2 = onlineTextSorter ? " " + onlineTextSorter.value : "" //same as offlineSearchButton
      const sortstring = supersort+extraSearch1+extraSearch2
      regenerate_online_notes(sortstring)
      console.log(sortstring)
    }
  }
 if (offlineBrowseButton) {
  offlineBrowseButton.onclick = () => {
    hook("screen","notes-online")
  }
 }
 if (onlineSorter) {
  onlineSorter.onchange = () => {
    const supersort = onlineTermSelector.value
    const extraSearch1 = onlineSorter ? " " + onlineSorter.value : ""
    const extraSearch2 = onlineTextSorter ? " " + onlineTextSorter.value : "" //same as offlineSearchButton
    const sortstring = supersort+extraSearch1+extraSearch2
    regenerate_online_notes(sortstring)
    console.log(sortstring)
  }
 }
 if (onlineBack) {
  onlineBack.onclick = () => {
    hook("screen","notes")
  }
 }
 downloadNoteButton.forEach((button)=>{
  button.onclick = () => {
    button.id = button.getAttribute("content")
    hook("download", button.getAttribute("content"), button)
    //button.disabled = true
  }
 })
  openButton.forEach((button)=>{
    button.onclick = () => {
      hook("file open", button.getAttribute("content"))
      
    }
 })
  recentsButton.forEach((button)=>{
    button.onclick = () => {
      hook("file open", button.getAttribute("content"))   
    }
 })
}

function regenerate_offline_notes(sort){
  const allButtons = document.getElementsByName("notes-offline-open-note")
  const sort1 = sort.toLowerCase().split(" ")[0] //the term
  let sort2 = ""
  const remsort = sort.toLowerCase().split(" ")
  remsort.shift()
  if (remsort) {
    sort2 = remsort.join(" ")
  }
  allButtons.forEach(button => {
    const content = button.getAttribute("content")
    if (content.includes(sort1) && content.includes(sort2)) {
      button.style.display = "inline"
    } else {
      button.style.display = "none"
    }
  });
}


function regenerate_online_notes(sort){
  const allButtons = document.getElementsByName("notes-online-download-note")
  const sort1 = sort.toLowerCase().split(" ")[0] //the term
  let sort2 = ""
  const remsort = sort.toLowerCase().split(" ")
  remsort.shift()
  if (remsort) {
    sort2 = remsort.join(" ")
  }
  allButtons.forEach(button => {
    const content = button.getAttribute("content")
    //console.log(content,sort)
    if (content.toLowerCase().includes(sort1.toLowerCase()) && 
    content.toLowerCase().includes(sort2.toLowerCase())) {
      button.style.display = "inline"
    } else {
      button.style.display = "none"
    }
  });
}

function generate_online_notes(barray,sort,availablesort,supersort) {
  const online = document.createElement("div")
  online.setAttribute("class","notes-online")
  const butngroup = document.createElement("div")
  const ctrlgroup = document.createElement("div")
  const termselection = document.createElement("select")
  termselection.setAttribute("class","notes-online-term-sorter")
  termselection.innerHTML = `
  <option value="firstterm">First Term</option>
  <option value="secondterm">Second Term</option>
  <option value="thirdterm">Third Term</option>
  `
  const sorter = document.createElement("select")
  sorter.setAttribute("class","notes-online-sorter")
  ctrlgroup.setAttribute("class","notes-online-control-group")
  const all = document.createElement("option")
  all.innerText = "All"
  all.value = ""
  sorter.add(all);
  const textsort = document.createElement("input")
  textsort.placeholder = "Search Notes"
  textsort.setAttribute("class","notes-online-text-sorter")
  availablesort.forEach(sorts => {
    const newsort = document.createElement("option")
    newsort.innerText = sorts
    newsort.value = sorts
    sorter.add(newsort);
  });
  ctrlgroup.append(termselection)
  ctrlgroup.append(sorter)
  ctrlgroup.append(textsort)
  online.append(ctrlgroup)
  if (barray.length > 0) {
    barray.forEach(element => {
      const lowerCase1 = element.toLowerCase()
      const lowerCase2 = ""//supersort.toLowerCase()+ " " +sort.toLowerCase() //Sorting not needed before generation
      if (lowerCase1.includes(lowerCase2)){
        element = element.replace("firstterm","") //Removes supersort
        element = element.replace("secondterm","") //Removes supersort
        element = element.replace("thirdterm","") //Removes supersort
        const newbutton = new IconButn(element,"notes-button","notes-button-text","file_download")
        newbutton.name = "notes-online-download-note" 
        newbutton.setAttribute("content",lowerCase1)
        newbutton.setAttribute("name","notes-online-download-note")
        butngroup.append(newbutton)
      }
    });
  } else {
    online.innerHTML = online.innerHTML + '<p class="offline-no-notes"> No school note available here. Contact Admin </p>'
  }
  online.append(butngroup)
  return online
}

export function disable_download_buttons(barray) {
  const downloadNoteButton = document.getElementsByName("notes-online-download-note")
  downloadNoteButton.forEach((button) => {
    const content = button.getAttribute("content").toLowerCase()
    if (barray.includes(content)) {
      button.disabled = true
    } else {
      button.disabled = false
    }
  })
}