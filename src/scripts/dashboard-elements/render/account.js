export function render_main_page(content,handle,userinfo) {
  content.replaceChildren()
  const heading = document.createElement("div")
  heading.innerHTML = `
  <h1> Account Settings </h1>
  <hr>` 
  const user_info = document.createElement("div")
  if (userinfo) {
    const username = userinfo.username
    const name = userinfo.firstname + " " + userinfo.surname
    const role = userinfo.student ? "Student" : "Teacher"
    user_info.innerHTML = `
    <span class="account-icon" title="Monitor Students">account_circle</span>
    <p class="account-user-name"> ${name} </p>
    <p class="account-user-role"> ${role} </p>
    `
    user_info.setAttribute("class","account-user-info")
  }
  content.append(heading)
  content.append(user_info)
  const user_tools = document.createElement("div")
  user_tools.setAttribute("class","account-user-tools")
  const logout = document.createElement("button")
  logout.innerText = "Log Out"
  logout.setAttribute("class","account-button")
  logout.onclick = () =>  handle("logout")
  user_tools.append(logout)
  content.append(user_tools)
}