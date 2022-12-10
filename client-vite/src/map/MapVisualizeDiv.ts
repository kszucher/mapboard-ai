import { updateMapDivData } from '../core/DomFlow'
import { getColors } from '../core/Colors'

export const mapVisualizeDiv = {
  start: (m: any, colorMode: string) => {
    const mapDiv: HTMLElement | null = document.getElementById('mapDiv')
    // @ts-ignore
    mapDiv.style.width = "" + m.mapWidth + "px"
    // @ts-ignore
    mapDiv.style.height = "" + m.mapHeight + "px"
    const mapHolderDiv : HTMLElement | null = document.getElementById('mapHolderDiv')
    // @ts-ignore
    mapHolderDiv.focus()
    mapVisualizeDiv.iterate(m, m.r[0], colorMode)
  },

  iterate: (m: any, cn: any, colorMode: string) => {
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
    cn.d.map((i: any) => mapVisualizeDiv.iterate(m, i, colorMode))
    cn.s.map((i: any) => mapVisualizeDiv.iterate(m, i, colorMode))
    cn.c.map((i: any[]) => i.map(j => mapVisualizeDiv.iterate(m, j, colorMode)))
  }
}
