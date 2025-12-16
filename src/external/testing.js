import * as dom from "./testing-dom.js"
const tempdata = sessionStorage.getItem("testdata")
const numberarea = document.getElementById("numberarea")
const testarea = document.getElementById("testarea")
const subjectlist = document.getElementById("subjectlist")

let data;

if (!tempdata) {
  console.error("No Data passed to Test Library")
} else {
  data = JSON.parse(tempdata)
  buildFirstUI(data,testarea,numberarea,subjectlist)
}


function buildFirstUI(data,testarea,numberarea,subjectlist) {
  data.banks.forEach(bank => {
    const header = dom.newSubjectHeader(bank.name)
    subjectlist.append(header)
  });

  if (data.banks[data.targetbank]) {
    //Generates the question if avaiable
    testarea.innerText = data.banks[data.targetbank].questions[data.targetquestion].textcontent
  }
}
