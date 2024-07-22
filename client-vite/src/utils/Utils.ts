import isEqual from "react-fast-compare"
export let IS_TESTING = false
export const setIsTesting = () => IS_TESTING = true
export const isArrayOfEqualValues = (array: any[]) => array.every(el => isEqual(el, array[0]))
export const isUrl = (string: string) => { try { return Boolean(new URL(string)) } catch(e) { return false } }
export const genNodeId = () => 'node' + crypto.randomUUID().slice(-8)
export const getLatexString = (s: string) => '\\Large ' + s.substring(2, s.length - 2).replace(/\s/g, '')
export const adjust = (x: number) => Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5
export const adjustIcon = (x: number) => !Number.isInteger(x) ? x + 0.5 : Math.ceil(x) - 0.5
export const getTableIndices = (r: number, c: number) => Array(r*c).fill(null).map((_, i) => [Math.floor(i/c), i%c])
export const filterEmpty = (array: any[]) => array.filter(el => Object.keys(el).length !== 0 && el.hasOwnProperty('nodeId') && el.hasOwnProperty('path'))
