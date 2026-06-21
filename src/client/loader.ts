const nextScene = (next: 0 | 1 | 2) => {
  if (next === 0) {
    console.log("Loader: Runtime blocked due to an error")
  } else if(next == 1) {
    console.log("Loader: Login details and ID found")
    window.location.href = "dashboard.html"
  } else if(next == 2){
    console.log("Loader: No login details or ID found")
    window.location.href = "login.html"
  }
}


window.runtime.init().then(response => {
  setTimeout(() => nextScene(response), 2)
})


