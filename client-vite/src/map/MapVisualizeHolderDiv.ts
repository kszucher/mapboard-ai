import {M} from "../types/DefaultProps"
import {scrollTo} from "../core/MapDivUtils"

export const orient = (m: M, action: string, payload: any) => {
  const mapDivOuter = document.getElementById('mapDivOuter') as HTMLDivElement
  const currScrollLeft = (window.innerWidth + m.g.mapWidth) / 2
  if (action === 'shouldLoad') {
    mapDivOuter.scrollLeft = currScrollLeft
    mapDivOuter.scrollTop = window.innerHeight - 48 * 2
  } else if (action === 'shouldResize') {
    mapDivOuter.scrollLeft = currScrollLeft
  } else if (action === 'shouldCenter') {
    scrollTo(currScrollLeft, 500)
  } else if (action === 'shouldScroll') {
    mapDivOuter.scrollLeft -= payload.movementX
    mapDivOuter.scrollTop -= payload.movementY
  }
}
