import z from "zod"
import {SchemaMap, DB_KEY} from "./types.ts"

export function getValue<K extends keyof typeof SchemaMap, T>(
  key: K,
  defaultReturn: T
): z.infer<typeof SchemaMap[K]> | T
{
  try {
    const schema = SchemaMap[key]
    const dbkey = DB_KEY+key
    const storageData = localStorage.getItem(dbkey)
    if (!storageData) {
      return defaultReturn
    }
    const data = JSON.parse(storageData)
    const result = schema.safeParse(data)
    if (result.success) {
      return result.data as z.infer<typeof SchemaMap[K]>
    } else {
      return defaultReturn
    }
  } catch {
    return defaultReturn
  }
}

export function updateValue<
  K extends keyof typeof SchemaMap, 
  T extends z.infer<typeof SchemaMap[K]>
>(
  key: K,
  newValue: T
) {
  const data = JSON.stringify(newValue)
  const dbkey = DB_KEY+key
  localStorage.setItem(dbkey, data)
}