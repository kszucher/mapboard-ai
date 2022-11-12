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

  iterate: (m, cm, colorMode) => {
    if (cm.type === 'struct' && !cm.hasCell) {
      const { nodeId, contentType, content, path, isEditing } = cm
      const {TEXT_COLOR} = getColors(colorMode)
      let styleData = {
        left:                       1 + cm.nodeStartX + 'px',
        top:                        1 + cm.nodeY - cm.selfH / 2 + 'px',
        minWidth:                   (m.density === 'large'?  0 : -3) + cm.selfW - m.padding - 2  + 'px',
        minHeight:                  (m.density === 'large'? -2 : -1) + cm.selfH - m.padding      + 'px',
        paddingLeft:                (m.density === 'large'?  0 :  3) +            m.padding - 2  + 'px',
        paddingTop:                 (m.density === 'large'?  0 :  0) +            m.padding - 2  + 'px',
        position:                   'absolute',
        fontSize:                   cm.textFontSize + 'px',
        fontFamily:                 'Roboto',
        textDecoration:             cm.linkType !== "" ? "underline" : "",
        cursor:                     'default',
        color:                      cm.textColor === 'default' ? TEXT_COLOR : cm.textColor,
        transition:                 'all 0.3s',
        transitionTimingFunction:   'cubic-bezier(0.0,0.0,0.58,1.0)',
        // transitionProperty:         'left, top, background-color',
      }
      updateMapDivData(nodeId, contentType, content, path, isEditing, styleData)
    }
    cm.d.map(i => mapVisualizeDiv.iterate(m, i, colorMode))
    cm.s.map(i => mapVisualizeDiv.iterate(m, i, colorMode))
    cm.c.map(i => i.map(j => mapVisualizeDiv.iterate(m, j, colorMode)))
  }
}
