export function is_safe(key) {
  const localKey = "REVALUATOR_"+key
  return sessionStorage.getItem(localKey) !== null
}

export function set_as(key,bol) {
  const localKey = "REVALUATOR_"+key
  if (bol) {
    sessionStorage.setItem(localKey,true)
  } else {
   sessionStorage.removeItem(localKey) 
  }
}

export default {
  set_as,
  is_safe
}