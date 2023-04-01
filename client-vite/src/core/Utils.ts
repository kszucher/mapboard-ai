export const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b)
export const isArrayOfEqualValues = (array: any[]) => array.every(el => el === array[0])
export const createArray = (dim1: number, dim2: number) => Array.from(Array(dim1), () => new Array(dim2))
export const copy = (thing: any) => JSON.parse(JSON.stringify(thing))
export const isUrl = (string: string) => { try { return Boolean(new URL(string)) } catch(e) { return false } }
export const transpose = (array2d: any[][]) => array2d[0].map((col, i) => array2d.map(row => row[i]))
export const dec2hex = (dec: number) => ('0' + dec.toString(16)).substr(-2)
export const genHash = (len: number) => {
  const arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return Array.from(arr, dec2hex).join('')
}
export const isOdd = (num: number) => num % 2
export const getLatexString = (s: string) => '\\Large ' + s.substring(2, s.length - 2).replace(/\s/g, '')
export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)

// WILL BE REMOVED once MapInit will be linearized
export const shallowCopy = (thing: any) => {
  if (thing === undefined) return undefined;
  if (typeof thing === 'number' && isFinite(thing)) {
    return thing
  } else {
    return thing.slice();
  }
}

// WILL BE REMOVED
export const subsref = (obj: any, path: any[]) : any => {
  try {
    return path.length ? subsref(obj[path[0]], path.slice(1)) : obj
  } catch {
    return undefined
  }
}

// WILL BE REMOVED
export const subsasgn = (obj: any, path: any[], value: any) => {
  let pathEnd = path.pop()
  for(let i = 0; i < path.length; i++) {
    obj = obj[path[i]] = obj[path[i]] || []
  }
  obj[pathEnd] = value
}
