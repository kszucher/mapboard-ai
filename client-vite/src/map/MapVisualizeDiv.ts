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

  iterate: (m: M, cn: N, colorMode: string) => {
    if (cn.type === 'struct' && !cn.hasCell) {
      const { nodeId, contentType, content, path } = cn
      const {TEXT_COLOR} = getColors(colorMode)
      let styleData = {
        left:                       1 + cn.nodeStartX + 'px',
        top:                        1 + cn.nodeY - cn.selfH / 2 + 'px',
        minWidth:                   (m.g.density === 'large'?  0 : -3) + cn.selfW - m.g.padding - 2  + 'px',
        minHeight:                  (m.g.density === 'large'? -2 : -1) + cn.selfH - m.g.padding      + 'px',
        paddingLeft:                (m.g.density === 'large'?  0 :  3) +            m.g.padding - 2  + 'px',
        paddingTop:                 (m.g.density === 'large'?  0 :  0) +            m.g.padding - 2  + 'px',
        position:                   'absolute',
        fontSize:                   cn.textFontSize + 'px',
        fontFamily:                 'Roboto',
        textDecoration:             cn.linkType !== "" ? "underline" : "",
        cursor:                     'default',
        color:                      cn.textColor === 'default' ? TEXT_COLOR : cn.textColor,
        transition:                 'all 0.3s',
        transitionTimingFunction:   'cubic-bezier(0.0,0.0,0.58,1.0)',
        // transitionProperty:         'left, top, background-color',
      }
      updateMapDivData(nodeId, contentType, content, path, styleData)
    }
    cn.d.map(i => mapVisualizeDiv.iterate(m, i, colorMode))
    cn.s.map(i => mapVisualizeDiv.iterate(m, i, colorMode))
    cn.c.map(i => i.map(j => mapVisualizeDiv.iterate(m, j, colorMode)))
  }
}
