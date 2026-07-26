const classes = ["jss1","jss2","jss3","sss1","sss2","sss3"]
const terms = ["firstterm","secondterm","thirdterm"]

export function extractSubjectName(array: string[]): string[] {
  const ret: string[] = []
  array.forEach(value  => {
    const seperated = value.split(" ")
    if (seperated[1]) {
      seperated[0] = ""
      const subject_only = seperated.join(" ")
      ret.push(subject_only)
    }
  })
  return ret
}

export function pretify(input: string){
  let strArray = input.toLowerCase().split(" ")
  strArray.forEach((word,i,a) => {
    if (word === "") {return}
    if (classes.includes(word)) {
      a[i] = word.toUpperCase()
    } else {
      if (terms.includes(word)) {
        a[i] = word.toLowerCase()
      } else {
        a[i] = word[0].toUpperCase() + word.slice(1)
      }
    }
  })
  return strArray.join(" ")
}

export function fixTerms(input: string) {
  
}

export function showAndHide(shown: HTMLElement, hidden: HTMLElement) {
  shown.style.display = ""
  hidden.style.display = "none" 
}

export function pretifyAll(strs: string[]) {
  strs.forEach((str,i,a) =>{
    a[i] = pretify(str)
  })
  return strs
}

export function addOptions(select: HTMLSelectElement,...options: string[]) {
  options.forEach(option => {
    const newOption = document.createElement("option")
    newOption.innerText = option
    newOption.value = option
    select.add(newOption);
  })
}

export async function getOnlineNotes(term: string) {
  const all: string[] = []
  const group: string[] = []
  let classes = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"]
  for (let index = 7; index < 13; index++) {
    const notes = await window.server.serverNotesInfo(index,term)
    notes.forEach((name,i,a) => {
      a[i] = term + " " + classes[index-7] + " " + name
    });
    if (notes.length > 0) {group.push(classes[index-7])}
    all.push(...notes)
  }
  return {
    "notes": all,
    "group": group
  }
}