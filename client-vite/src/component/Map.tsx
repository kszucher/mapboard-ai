import React, {FC, useEffect, useRef} from "react"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"
import {RootStateOrAny, useSelector} from "react-redux";
import {N} from "../state/NPropsTypes";
import {G} from "../state/GPropsTypes";
import {scrollTo} from "./MapDivUtils";
import {useOpenWorkspaceQuery} from "../core/Api";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState";
import {getG} from "../map/MapUtils";

const getScrollLeft = (g: G) => (window.innerWidth + g.mapWidth) / 2
const getScrollTop = () => (window.innerHeight - 48 * 2)

export const Map: FC = () => {
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const m = tm.length ? tm : mapList[mapListIndex]
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
      onMouseDown={() => {
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          if (e.buttons === 4) {
            if (mainMapDiv.current) {
              mainMapDiv.current.scrollLeft -= e.movementX
              mainMapDiv.current.scrollTop -= e.movementY
            }
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
        }, { signal })
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          scrollTo(getScrollLeft(g), 500)
        }
      }}
    >
      <div
        style={{position: 'relative', paddingTop: '100vh', paddingLeft: '100vw'}}
      >
        <MapSvg/>
        <MapDiv/>
      </div>
    </div>
  )
}
