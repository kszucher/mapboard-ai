import {FC, useEffect, useRef} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getG} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode} from "../../state/Enums.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {MapDiv} from "./MapDiv"
import {setScrollLeftAnimated} from "./MapDivUtils"
import {MapSvg} from "./MapSvg"

export const Map: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const scrollOverride = useSelector((state: RootState) => state.editor.scrollOverride)
  const zoomInfo = useSelector((state: RootState) => state.editor.zoomInfo)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { density } = g
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
    window.addEventListener('resize', () => {
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
    }}, [density]
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
        if (e.button === 1) {
          e.preventDefault()
        }
        dispatch(actions.mapAction({type: 'saveFromCoordinates', payload: {e}}))
        let didMove = false
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          didMove = true
          if (e.button === 0 && leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE) {
            dispatch(actions.mapAction({type: 'selectByRectanglePreview', payload: {e}}))
          } else if (e.button === 0 && leftMouseMode === LeftMouseMode.SELECT_BY_CLICK_OR_MOVE) {
            setScrollLeft(mainMapDiv.current!.scrollLeft - e.movementX)
            setScrollTop(document.documentElement.scrollTop - e.movementY)
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
          if (didMove && e.button === 0 && leftMouseMode === LeftMouseMode.SELECT_BY_RECTANGLE) {
            dispatch(actions.mapAction({type: 'selectByRectangle', payload: {e}}))
          }
        }, { signal })
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          resetView()
        }
      }}
      onWheel={(e) => {
        if (scrollOverride) {
          dispatch(actions.mapAction({type: 'saveView', payload: {e}}))
        }
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
