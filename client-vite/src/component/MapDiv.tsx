import {FC, Fragment} from "react"
import {RootStateOrAny, useSelector} from "react-redux"
import {getColors} from "../core/Colors"
import {M, N} from "../types/DefaultProps"
import {m2ml} from "../core/MapUtils"
import {getLatexString} from "../core/Utils"
// @ts-ignore
import katex from "katex/dist/katex.mjs"

const getInnerHtml = (n: N) => {
  if (n.contentType === 'text') {
    return n.content
  } else if (n.contentType === 'equation') {
    return katex.renderToString(getLatexString(n.content), {throwOnError: false})
  } else if (n.contentType === 'image') {
    let imageLink = 'https://mapboard.io/file/'
    return '<img src="' + imageLink + n.content + '" alt="" id="img">'
  }
}

export const MapDiv: FC = () => {
  const colorMode = 'dark'
  const C = getColors(colorMode)
  const mdi = useSelector((state: RootStateOrAny) => state.editor.mapIndexList)
  const md = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const m = md[mdi] // use "vm" meaning any map source that needs to be visualized!!!
  const ml = m2ml(m)

  return (
    <div
      id='mapDiv'
      style={{
        position: 'absolute',
        display: 'flex',
        pointerEvents: 'none'
      }}
    >
      <>
        {ml.map((n: N) => (
          <Fragment key={n.nodeId}>
            {
              n.type === 'struct' &&
              !n.hasCell &&
              <div
                style = {{
                  left: 1 + n.nodeStartX,
                  top: 1 + n.nodeY - n.selfH / 2,
                  minWidth: (m.g.density === 'large'?  0 : -3) + n.selfW - m.g.padding - 2,
                  minHeight: (m.g.density === 'large'? -2 : -1) + n.selfH - m.g.padding,
                  paddingLeft: (m.g.density === 'large'?  0 :  3) + m.g.padding - 2,
                  paddingTop: (m.g.density === 'large'?  0 :  0) + m.g.padding - 2,
                  position: 'absolute',
                  fontSize: n.textFontSize,
                  fontFamily: 'Roboto',
                  textDecoration: n.linkType !== "" ? "underline" : "",
                  cursor: 'default',
                  color: n.textColor === 'default' ? C.TEXT_COLOR : n.textColor,
                  transition: 'all 0.3s',
                  transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                }}
                dangerouslySetInnerHTML={{__html: getInnerHtml(n)}}
                // contentEditable={}
              >
              </div>
            }
          </Fragment>
        ))}
      </>
    </div>
  )
}
