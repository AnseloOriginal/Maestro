function notesHook(func,value) {
  if (func === "osearch") {
    console.log("User searched "+value)
  }
}

export default {notesHook}
