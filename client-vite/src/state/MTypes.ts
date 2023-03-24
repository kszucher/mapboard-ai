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

export type GN = G & N
export type GNPartial = GPartial & NPartial
export type ML = GN[]
export type MLPartial = GNPartial[]

export type PathItem = 'g' | 'r' | 'd' | 's' | 'c' | number
export type Path = PathItem[]
