import React, {FC, useEffect, useRef} from "react"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {mSelector} from "../state/EditorState"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"
import {useDispatch, useSelector} from "react-redux"
import {setScrollLeftAnimated} from "./MapDivUtils"
import {useOpenWorkspaceQuery} from "../apis/NodeApi"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"
import {getG} from "../selectors/MapSelector"

export const Map: FC = () => {
  const zoomInfo = useSelector((state: RootState) => state.editor.zoomInfo)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { density, alignment } = g
  const { data } = useOpenWorkspaceQuery()
  const { mapId, frameId } = data || defaultUseOpenWorkspaceQueryState

  const dispatch = useDispatch<AppDispatch>()

  const resetView = () => {
    dispatch(actions.setZoomInfo({scale: 1, prevMapX: 0, prevMapY: 0, translateX: 0, translateY: 0, originX: 0, originY: 0}))
    setScrollLeft((window.innerWidth + g.mapWidth) / 2)
    setScrollTop(window.innerHeight - 40 * 2)
  }

  const mainMapDiv = useRef<HTMLDivElement>(null)
  const setScrollLeft = (x: number) => mainMapDiv.current!.scrollLeft = x
  const setScrollTop = (y: number) => window.scrollTo(0, y)

  useEffect(() => {
    const abortController = new AbortController()
    const { signal } = abortController
    window.addEventListener('resize', (e) => {
      setScrollLeft((window.innerWidth + g.mapWidth) / 2)
    }, { signal })
    return () => abortController.abort()
  }, [])

  useEffect(() => {
    if (mainMapDiv.current) {
      resetView()
    }}, [mapId, frameId]
  )

  useEffect(() => {
    if (mainMapDiv.current) {
      setScrollLeftAnimated((window.innerWidth + g.mapWidth) / 2, 500)
    }}, [density] // TODO figure out how to react to the end of moveTarget
  )

  return (
    <div
      style={{
        overflow: 'auto',
        display: 'grid',
        gridTemplateRows: `100vh ${g.mapHeight}px 100vh`,
        gridTemplateColumns: `100vw ${g.mapWidth}px 100vw`,
      }}
      ref={mainMapDiv}
      id={'mainMapDiv'}
      onMouseDown={(e) => {
        e.preventDefault()
        if (e.button === 0) {
          dispatch(actions.closeContextMenu())
        } else if (e.button === 2) {
          dispatch(actions.openContextMenu({type: 'map', position: {x: e.clientX, y: e.clientY}}))
        }
      }}
      onMouseMove={(e) => {
        e.preventDefault()
        if (e.buttons === 4) {
          setScrollLeft(mainMapDiv.current!.scrollLeft - e.movementX)
          setScrollTop(document.documentElement.scrollTop - e.movementY)
        }
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          resetView()
        }
      }}
      onWheel={(e) => {
        dispatch(actions.mapAction({type: 'saveView', payload: {e}}))
      }}
    >
      <div/>
      <div/>
      <div/>
      <div/>
      <div style={{
        position: 'relative',
        display: 'flex',
        transform: `scale(${zoomInfo.scale}) translate(${zoomInfo.translateX}px, ${zoomInfo.translateY}px)`,
        transformOrigin: `${zoomInfo.originX}px ${zoomInfo.originY}px`
      }}>
        <MapSvg/>
        <MapDiv/>
      </div>
      <div/>
      <div/>
      <div/>
    </div>
  )
}
