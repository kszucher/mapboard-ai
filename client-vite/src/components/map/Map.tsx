import {FC, useEffect, useRef} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getG} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {LeftMouseMode, MapMode, MidMouseMode} from "../../state/Enums.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {MapDiv} from "./MapDiv"
import {setScrollLeftAnimated} from "./MapDivUtils"
import {MapSvg} from "./MapSvg"

export const Map: FC = () => {
  const mapEditMode = useSelector((state: RootState) => state.editor.mapEditMode)
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode)
  const zoomInfo = useSelector((state: RootState) => state.editor.zoomInfo)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { density } = g
  const { data } = useOpenWorkspaceQuery()
  const { mapId, frameId } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))

  const resetView = () => {
    dispatch(actions.setZoomInfo({scale: 1, prevMapX: 0, prevMapY: 0, translateX: 0, translateY: 0, originX: 0, originY: 0}))
    setScrollLeft((window.innerWidth + g.selfW) / 2)
    setScrollTop(window.innerHeight - 40 * 2)
  }

  const mainMapDiv = useRef<HTMLDivElement>(null)
  const setScrollLeft = (x: number) => mainMapDiv.current!.scrollLeft = x
  const setScrollTop = (y: number) => window.scrollTo(0, y)

  useEffect(() => {
    const abortController = new AbortController()
    const { signal } = abortController
    window.addEventListener('resize', () => {
      setScrollLeft((window.innerWidth + g.selfW) / 2)
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
      setScrollLeftAnimated((window.innerWidth + g.selfW) / 2, 500)
    }}, [density]
  )

  return (
    <div
      style={{
        overflow: 'auto',
        display: 'grid',
        gridTemplateRows: `100vh ${g.selfH}px 100vh`,
        gridTemplateColumns: `100vw ${g.selfW}px 100vw`,
      }}
      ref={mainMapDiv}
      id={'mainMapDiv'}
      onMouseDown={(e) => {
        if (e.button === 1 && e.buttons === 4) {
          e.preventDefault()
        }
        if (e.button === 0) {
          if (leftMouseMode === LeftMouseMode.RECTANGLE_SELECT && mapEditMode === MapMode.STRUCT) {
            md(MR.saveFromCoordinates, {e})
          }
        }
        let didMove = false
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          didMove = true
          if (e.button === 0 && e.buttons === 1 && leftMouseMode === LeftMouseMode.RECTANGLE_SELECT && mapEditMode === MapMode.STRUCT) {
            md(MR.selectSByRectanglePreview, {e})
          } else if (e.button === 0 && e.buttons === 1 && leftMouseMode !== LeftMouseMode.RECTANGLE_SELECT) {
            setScrollLeft(mainMapDiv.current!.scrollLeft - e.movementX)
            setScrollTop(document.documentElement.scrollTop - e.movementY)
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
          if (didMove && e.button === 0 && leftMouseMode === LeftMouseMode.RECTANGLE_SELECT && mapEditMode === MapMode.STRUCT) {
            md(MR.selectSByRectangle, {e})
          }
        }, { signal })
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          resetView()
        }
      }}
      onWheel={(e) => {
        if (midMouseMode === MidMouseMode.ZOOM) {
          md(MR.saveView, {e})
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
