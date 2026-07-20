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