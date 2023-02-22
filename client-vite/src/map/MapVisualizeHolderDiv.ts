import {M} from "../types/DefaultProps"
import {scrollTo} from "../core/DomUtils";

export const orient = (m: M, action: string, payload: any) => {
  const mapHolderDiv = document.getElementById('mapHolderDiv')
  const currScrollLeft = (window.innerWidth + m.g.mapWidth) / 2
  if (action === 'shouldLoad') {
    mapHolderDiv!.scrollLeft = currScrollLeft
    mapHolderDiv!.scrollTop = window.innerHeight - 48 * 2
  } else if (action === 'shouldResize') {
    mapHolderDiv!.scrollLeft = currScrollLeft
  } else if (action === 'shouldCenter') {
    scrollTo(currScrollLeft, 500)
  } else if (action === 'shouldScroll') {
    mapHolderDiv!.scrollLeft -= payload.movementX
    mapHolderDiv!.scrollTop -= payload.movementY
  }
}
