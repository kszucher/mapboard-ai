// @ts-nocheck

import { updateMapDivData } from '../core/DomFlow'
import { getColors } from '../core/Colors'

export const mapVisualizeDiv = {
  start: (m, cr, colorMode) => {
    const mapDiv = document.getElementById('mapDiv')
    mapDiv.style.width = "" + m.mapWidth + "px"
    mapDiv.style.height = "" + m.mapHeight + "px"
    const mapHolderDiv = document.getElementById('mapHolderDiv')
    mapHolderDiv.focus()
    mapVisualizeDiv.iterate(m, cr, colorMode)
  },

  iterate: (m, cn, colorMode) => {
    if (cn.type === 'struct' && !cn.hasCell) {
      const { nodeId, contentType, content, path } = cn
      const {TEXT_COLOR} = getColors(colorMode)
      let styleData = {
        left:                       1 + cn.nodeStartX + 'px',
        top:                        1 + cn.nodeY - cn.selfH / 2 + 'px',
        minWidth:                   (m.density === 'large'?  0 : -3) + cn.selfW - m.padding - 2  + 'px',
        minHeight:                  (m.density === 'large'? -2 : -1) + cn.selfH - m.padding      + 'px',
        paddingLeft:                (m.density === 'large'?  0 :  3) +            m.padding - 2  + 'px',
        paddingTop:                 (m.density === 'large'?  0 :  0) +            m.padding - 2  + 'px',
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
