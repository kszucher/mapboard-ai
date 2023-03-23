import {NPartial} from "./NPropsTypes"
import {N} from "./NPropsTypes"
import {G, GPartial} from "./GPropsTypes"

export interface M {
  g: G,
  r: N[]
}

export interface MPartial {
  g: GPartial,
  r: NPartial[]
}

export type NL = N & G
export type NLPartial = NPartial | GPartial
export type ML = NL[]
export type MLPartial = NLPartial[]

type PathItem = 'g' | 'r' | 'd' | 's' | 'c' | number
export type Path = PathItem[]
