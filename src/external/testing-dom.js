export function newSubjectHeader(name) {
  const button = document.createElement("button")
  button.setAttribute("class","subject-list")
  button.id = "subject-list-"+name
  button.innerText = name
  return button
}