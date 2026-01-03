export function isNewWeek() {
  const now = Date.now()
  if (localStorage.getItem('last_known_monday')) {
    const lastKnownMonday = new Date(localStorage.getItem('last_known_monday'))
    const diff = Math.floor((lastKnownMonday.getTime() - now) / 1000 / 60 / 60 / 24)
    if (diff >= 7) {
      const lastMonday = getLastMonday()
      localStorage.setItem('last_known_monday',JSON.stringify(lastMonday))
      return true
    } else {
      return false
    }
  } else {
    const lastMonday = getLastMonday()
    localStorage.setItem('last_known_monday',JSON.stringify(lastMonday))
    return true
  }
}

function getLastMonday() {
  const date = new Date()
  if (date.getDay() === 1) {
    return date
  } else {
    const diff = date.getDate() - ((date.getDay() || 7) - 1)
    if (diff > 0) {
      date.setDate(diff)
    } else {
      date.setDate(diff)
      if (date.getMonth() > 0) {
        date.setMonth(date.getMonth-1)
      } else {
        date.setFullYear(date.getFullYear()-1,0)
      }
    }
    return date
  }
}

export default {isNewWeek}