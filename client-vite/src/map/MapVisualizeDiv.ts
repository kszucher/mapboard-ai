import {M, N} from "../types/DefaultProps"
import { updateMapDivData } from '../core/DomFlow'
import { getColors } from '../core/Colors'

export const mapVisualizeDiv = {
  start: (m: M, colorMode: string) => {
    const mapDiv: HTMLElement | null = document.getElementById('mapDiv')
    mapDiv!.style.width = "" + m.g.mapWidth + "px"
    mapDiv!.style.height = "" + m.g.mapHeight + "px"
    const mapHolderDiv: HTMLElement | null = document.getElementById('mapHolderDiv')
    mapHolderDiv?.focus()
    mapVisualizeDiv.iterate(m, m.r[0], colorMode)
  },

  iterate: (m: M, n: N, colorMode: string) => {
    if (n.type === 'struct' && !n.hasCell) {
      const { nodeId, contentType, content, path } = n
      const {TEXT_COLOR} = getColors(colorMode)
      const styleData = {
        left: 1 + n.nodeStartX + 'px',
        top: 1 + n.nodeY - n.selfH / 2 + 'px',
        minWidth: (m.g.density === 'large'?  0 : -3) + n.selfW - m.g.padding - 2 + 'px',
        minHeight: (m.g.density === 'large'? -2 : -1) + n.selfH - m.g.padding + 'px',
        paddingLeft: (m.g.density === 'large'?  0 :  3) + m.g.padding - 2  + 'px',
        paddingTop: (m.g.density === 'large'?  0 :  0) + m.g.padding - 2  + 'px',
        position: 'absolute',
        fontSize: n.textFontSize + 'px',
        fontFamily: 'Roboto',
        textDecoration: n.linkType !== "" ? "underline" : "",
        cursor: 'default',
        color: n.textColor === 'default' ? TEXT_COLOR : n.textColor,
        transition: 'all 0.3s',
        transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
      }
      updateMapDivData(nodeId, contentType, content, path, styleData)
    }
    n.d.map(i => mapVisualizeDiv.iterate(m, i, colorMode))
    n.s.map(i => mapVisualizeDiv.iterate(m, i, colorMode))
    n.c.map(i => i.map(j => mapVisualizeDiv.iterate(m, j, colorMode)))
  }
}
