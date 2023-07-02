import React, {FC, useEffect, useRef} from "react"
import {RootState} from "../core/EditorReducer"
import {mSelector} from "../state/EditorState"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"
import {useSelector} from "react-redux"
import {scrollTo} from "./MapDivUtils"
import {useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {getG} from "../core/MapUtils"
import {G, N} from "../state/MapPropTypes"

const getScrollLeft = (g: G) => (window.innerWidth + g.mapWidth) / 2
const getScrollTop = () => (window.innerHeight - 40 * 2)

export const Map: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { density, alignment } = g
  const { data } = useOpenWorkspaceQuery()
  const { mapId, frameId } = data || defaultUseOpenWorkspaceQueryState
  const mainMapDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const { signal } = abortController
    window.addEventListener('resize', (e) => {
      if (mainMapDiv.current) {
        mainMapDiv.current.scrollLeft = getScrollLeft(g)
      }
    }, { signal })
    return () => abortController.abort()
  }, [])

  useEffect(() => {
    if (mainMapDiv.current) {
      mainMapDiv.current.scrollLeft = getScrollLeft(g)
      mainMapDiv.current.scrollTop = getScrollTop()
    }}, [mapId, frameId]
  )

  useEffect(() => {
    if (mainMapDiv.current) {
      scrollTo(getScrollLeft(g), 500)
    }}, [density, alignment] // TODO figure out how to react to the end of moveTarget
  )

  return (
    <div
      style={{overflowY: 'scroll', overflowX: 'scroll'}}
      ref={mainMapDiv}
      id={'mainMapDiv'}
      onMouseDown={(e) => {
        e.preventDefault()}
      }
      onMouseMove={(e) => {
        e.preventDefault()
        if (e.buttons === 4) {
          if (mainMapDiv.current) {
            mainMapDiv.current.scrollLeft -= e.movementX
            mainMapDiv.current.scrollTop -= e.movementY
          }
        }
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          scrollTo(getScrollLeft(g), 500)
        }
      }}
    >
      <div style={{position: 'relative', paddingTop: '100vh', paddingLeft: '100vw'}}>
        <div style={{ position: 'absolute', display: 'flex', width: 'calc(100vw + ' + g.mapWidth + 'px)', height: 'calc(100vh + ' + g.mapHeight + 'px)'}}>
          <MapSvg/>
          <MapDiv/>
        </div>
      </div>
    </div>
  )
}
