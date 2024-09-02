export const isArrayOfEqualValues = (array: any[]) => new Set(array).size === 1
export const isUrl = (string: string) => { try { return Boolean(new URL(string)) } catch(e) { return false } }
export const genId = () => crypto.randomUUID().slice(-8)
export const getLatexString = (s: string) => '\\Large ' + s.substring(2, s.length - 2).replace(/\s/g, '')
export const adjust = (x: number) => Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5
export const adjustIcon = (x: number) => !Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5
export const filterObject = (obj: object, keys: string[]) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)))
export const getNonDefaultObjectKeys = (obj: object, defaultObj: object) => Object.keys(obj).filter(key => obj[key as keyof typeof obj] !== defaultObj[key as keyof typeof defaultObj])
