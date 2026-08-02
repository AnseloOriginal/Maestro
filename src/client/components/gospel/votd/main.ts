import { startingDay, bibleList } from "./list"

export function getVerseOfTheDay() {
  const secondsPassed = Date.now() - startingDay
  const days = Math.floor(secondsPassed / 60 / 60 / 24)
  const index = days % bibleList.length
  return bibleList[index]
}