import revaluator from './revaluator.js';
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
  cache.userinfo = userInfoResult
  return userInfoResult
}

export async function serverOnline() {
  cache.server = await window.runtime.serverOnline()
  return cache.server
}

export function get(request) {
  if (request === "student") {
    return cache.userinfo.student
  } else if (request === "disabled") {
    return cache.userinfo.disabled
  } else if (request === "verified") {
    return cache.userinfo.verified
  } else if (request === "failed") {
    if (!("userinfo" in cache) || cache?.userinfo?.failed) {return true}
    else {return false}
  } else if (request === "server status") {
    return cache.server
  }
}

export function pretify(input){
  let classes = ["jss1","jss2","jss3","sss1","sss2","sss3"]
  let terms = ["firstterm","secondterm","thirdterm"]
  const inbuilt = (str) => {
    let strArray = str.toLowerCase().split(" ")
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
  return inbuilt(input)
}

export async function getFormatedDownloadedNotes() {
  const notes = await window.fs.notes()
  notes.forEach((note,i,a) =>{
    a[i] = pretify(note.toLowerCase())
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
  await cacheOnlineNotes("firstterm")
  await cacheOnlineNotes("secondterm")
  await cacheOnlineNotes("thirdterm")
  console.log(cache.onlinenotes)
  return cache.onlinenotes
}

async function cacheOnlineNotes(term) {
  if (!cache.onlinenotes) {cache.onlinenotes = []}
  let all = []
  let group = []
  let classes = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"]
  for (let index = 7; index < 13; index++) {
    const temp = await window.server.serverNotesInfo(index,term)
    temp.forEach((name,i,a) => {
      a[i] = term + " " + classes[index-7] + " " + name
    });
    if (temp.length > 0) {group.push(classes[index-7])}
    all.push(...temp)
  }
  cache.onlinenotes.push(...all)
  cache.onlinegroup = group
}

async function cacheGet(key,fallback) {
  const cacheKey = "CACHE_"+key
  if (localStorage.getItem(cacheKey) !== null && revaluator.is_safe(key)) {
    return JSON.parse(localStorage.getItem(cacheKey))
  } else {
    if (typeof fallback === "function") {
      const result = await fallback()
      JSON.stringify(localStorage.setItem(cacheKey,result))
      revaluator.set_as(key,true)
    } else {
      return fallback
    }
  }
}

async function cacheSet(key,data) {
  const cacheKey = "CACHE_"+key
  if (typeof data === "function") {
    const result = await data()
    localStorage.setItem(cacheKey,JSON.stringify(result))
  } else {
    localStorage.setItem(cacheKey,JSON.stringify(data))
  }
}

function cacheHas(key) {
  const cacheKey = "CACHE_"+key
  return localStorage.getItem(cacheKey) !== null
}
export default {
  getUserInfo,
  cache,
  get,
  getFormatedDownloadedNotes,
  getOnlineNotesGroups,
  getOnlineNotesAvailable,
  serverOnline,
  pretify,
  cacheGet,
  cacheSet,
  cacheHas
}