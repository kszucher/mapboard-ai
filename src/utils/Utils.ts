import isEqual from "react-fast-compare"

export const hasTrues = (array: any[]): boolean => array.length > 0 && array.every(el => el === true)
export const hasEquals = (array: any[]): boolean => array.length > 0 && array.every(el => isEqual(el, array[0]))
export const getEquals = (array: any[]): any => array.length > 0 && array.every(el => el === array[0]) ? array[0] : undefined
export const isUrl = (string: string) => { try { return Boolean(new URL(string)) } catch(e) { return false } }
export const genId = () => crypto.randomUUID().slice(-8)
export const getLatexString = (s: string) => '\\Large ' + s.substring(2, s.length - 2).replace(/\s/g, '')
export const adjust = (x: number) => Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5
export const adjustIcon = (x: number) => !Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5
export const includeEntries = (obj: object, keys: string[]) => Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)))
export const excludeEntries = (obj: object, keys: string[]) => Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)))
export const getNonDefaultEntries = (obj: object, defaultObj: object) => Object.keys(obj).filter(key => obj[key as keyof typeof obj] !== defaultObj[key as keyof typeof defaultObj])
export const removeWhitespaces = (str: string) => str.replace(/&nbsp;/g, ' ')
