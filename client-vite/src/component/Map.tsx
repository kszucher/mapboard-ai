import React, {FC, useEffect, useRef} from "react"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"
import {RootStateOrAny, useSelector} from "react-redux";
import {N} from "../state/NPropsTypes";
import {G} from "../state/GPropsTypes";
import {scrollTo} from "./MapDivUtils";
import {useOpenWorkspaceQuery} from "../core/Api";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState";

const getCenter = (g: G) => (window.innerWidth + g.mapWidth) / 2

export const Map: FC = () => {
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const ml = tm && Object.keys(tm).length ? tm : mapList[mapListIndex]
  const g = ml.filter((n: N) => n.path.length === 1).at(0)
  const { density, alignment } = g
  const { data } = useOpenWorkspaceQuery()
  const { mapId, frameId } = data || defaultUseOpenWorkspaceQueryState
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const abortController = new AbortController()
    const { signal } = abortController
    window.addEventListener('resize', (e) => {
      if (divRef.current) {
        divRef.current.scrollLeft = getCenter(g)
      }
    }, { signal })
    return () => abortController.abort()
  }, [])

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollLeft = getCenter(g)
      divRef.current.scrollTop = window.innerHeight - 48 * 2
    }}, [mapId, frameId]
  )

  useEffect(() => {
    if (divRef.current) {
      scrollTo(getCenter(g), 500)
    }
  }, [density, alignment]) // TODO figure out how to react to the end of moveTarget

  return (
    <div
      ref={divRef}
      id={'mapDivOuter'}
      onMouseDown={(e) => {
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          if (e.buttons === 4) {
            if (divRef.current) {
              divRef.current.scrollLeft -= e.movementX
              divRef.current.scrollTop -= e.movementY
            }
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
        }, { signal })
      }}
      onDoubleClick={(e) => {
        if (divRef.current) {
          scrollTo(getCenter(g), 500)
        }
      }}
      style={{
        overflowY: 'scroll',
        overflowX: 'scroll'
      }}>
      <div
        style={{
          position: 'relative',
          paddingTop: '100vh',
          paddingLeft: '100vw',
          maxWidth: '100%'
        }}
      >
        <MapSvg/>
        <MapDiv/>
      </div>
    </div>
  )
}
