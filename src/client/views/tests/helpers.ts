import { number } from "zod"

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: "numeric",
  minute:  "numeric"
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: "long",
  day: "2-digit"
});
export function convertOfflineTestToTuple(
  data: {[key: string]: number[]},
  publicTest: [string, string][]
) {
  const publicTestDict: {[key: string]: string | undefined} = {}
  publicTest.forEach(test => {
    const name = test[0]
    const uuid = test[1]
    publicTestDict[uuid] = name
  })
  const newData: [string, string][] = []
  for (const [uuid, testSuite] of Object.entries(data)) {
    const name = publicTestDict[uuid]
    if (!name) {
      continue
    }
    
    
    testSuite.forEach(test => {
      const time = dateNumToString(test)
      const displayName = `${name} at ${time}`
      newData.push([displayName, uuid])
    })
  }
  return newData
}

const dateNumToString = (n: number) => timeFormatter.format(n) + " " + dateFormatter.format(n)