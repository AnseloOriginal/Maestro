//Returns if a user is a worker/student and usernames. Authorization levels and if use user's account is enabled
const cache = {}

export async function getUserInfo() {
  let userInfoResult = await window.server.serverUserInfo()
  if (userInfoResult[0] === 1) {
    userInfoResult.failed = true
  }
  if (typeof(userInfoResult) !== 'object'){
    throw Error("Returned something not a table")
  }
  cache.user = userInfoResult
}

export async function serverOnline() {
  cache.server = await window.runtime.serverOnline()
  return cache.server
}

export function get(request) {
  if (request === "student") {
    return cache.user.student
  } else if (request === "disabled") {
    return cache.user.disabled
  } else if (request === "verified") {
    return cache.user.verified
  } else if (request === "failed") {
    if (!("user" in cache) || cache?.user?.failed) {return true}
    else {return false}
  } else if (request === "server status") {
    return cache.server
  }
}

export function pretify(input){
  let classes = ["jss1","jss2","jss3","sss1","sss2","sss3"]
  const inbuilt = (str) => {
    let strArray = str.toLowerCase().split(" ")
    strArray.forEach((word,i,a) => {
      if (word === "") {return}
      if (classes.includes(word)) {
        a[i] = word.toUpperCase()
      } else {
        a[i] = word[0].toUpperCase() + word.slice(1)
      }
    })
    return strArray.join(" ")
  }
  return inbuilt(input)
}

export async function getFormatedDownloadedNotes() {
  const notes = await window.fs.notes()
  notes.forEach((note,i,a) =>{
    a[i] = pretify(note)
  }
)
  return notes
}

export function getOnlineNotesGroups() {
  if (cache.onlinegroup) {
    return cache.onlinegroup
  } else {
    return []
  }
}

export async function getOnlineNotesAvailable() {
  await cacheOnlineNotes()
  return cache.onlinenotes
}

async function cacheOnlineNotes() {
  let all = []
  let group = []
  let classes = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"]
  for (let index = 7; index < 13; index++) {
    const temp = await window.server.serverNotesInfo(index)
    temp.forEach((name,i,a) => {
      a[i] = classes[index-7] + " " + name
    });
    if (temp.length > 0) {group.push(classes[index-7])}
    all.push(...temp)
  }
  cache.onlinenotes = all
  cache.onlinegroup = group
}

export default {
  getUserInfo,
  cache,
  get,
  getFormatedDownloadedNotes,
  getOnlineNotesGroups,
  getOnlineNotesAvailable,
  serverOnline,
  pretify
}