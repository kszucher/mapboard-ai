import { updateMapDivData } from '../core/DomFlow'
import { getColors } from '../core/Colors'

const scrollTo = function(to, duration) {
    const
      element = document.getElementById('mapHolderDiv'),
      start = element.scrollLeft,
      change = to - start,
      startDate = +new Date(),
      // t = current time
      // b = start value
      // c = change in value
      // d = duration
      easeOut = function(t, b, c, d) {
          //https://www.gizma.com/easing/
          // https://easings.net/
          // https://css-tricks.com/ease-out-in-ease-in-out/
          // TODO: trying to set if for everything
          t /= d
          t--
          return c*(t*t*t + 1) + b
      },
      animateScroll = function() {
          const currentDate = +new Date()
          const currentTime = currentDate - startDate
          element.scrollLeft = parseInt(easeOut(currentTime, start, change, duration))
          if(currentTime < duration) {
              requestAnimationFrame(animateScroll)
          }
          else {
              element.scrollLeft = to
          }
      }
    animateScroll()
}

export const mapVisualizeDiv = {
    start: (m, cr, colorMode) => {
        let mapDiv = document.getElementById('mapDiv')
        mapDiv.style.width = "" + m.mapWidth + "px"
        mapDiv.style.height = "" + m.mapHeight + "px"
        let mapHolderDiv = document.getElementById('mapHolderDiv')
        mapHolderDiv.focus()
        let currScrollLeft = (window.innerWidth + m.mapWidth) / 2
        if (m.shouldLoad) { // shouldLoad
            m.shouldLoad = false
            mapHolderDiv.scrollLeft = currScrollLeft
            mapHolderDiv.scrollTop = window.innerHeight - 48 * 2
        }
        if (m.shouldResize) { // shouldResize
            m.shouldResize = false
            mapHolderDiv.scrollLeft = currScrollLeft
        }
        if (m.shouldCenter) {
            m.shouldCenter = false
            scrollTo(currScrollLeft, 500)
        }
        if (m.shouldScroll) {
            m.shouldScroll = false
            mapHolderDiv.scrollLeft -= m.scrollX
            mapHolderDiv.scrollTop -= m.scrollY
        }
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
