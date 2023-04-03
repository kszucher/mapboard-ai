import {NPartial} from "./NPropsTypes"
import {N} from "./NPropsTypes"
import {G, GPartial} from "./GPropsTypes"

export type GN = G & N
export type GNPartial = GPartial & NPartial
export type M = GN[]
export type MPartial = GNPartial[]
export type PathItem = 'g' | 'r' | 'd' | 's' | 'c' | number
export type Path = PathItem[]
