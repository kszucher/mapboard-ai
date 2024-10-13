import {FC, useEffect, useRef} from "react"
import {useDispatch, useSelector} from "react-redux"
import {defaultUseOpenWorkspaceQueryState} from "../apiState/ApiState.ts"
import {getColors} from "./Colors.ts"
import {actions} from "../editorMutations/EditorMutations.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {LeftMouseMode, MidMouseMode} from "../editorState/EditorEnums.ts"
import {getG} from "../mapQueries/MapQueries.ts"
import {AppDispatch, RootState, useOpenWorkspaceQuery} from "../rootComponent/RootComponent.tsx"
import {MapDivL} from "./MapDivL.tsx"
import {MapDivR} from "./MapDivR.tsx"
import {MapSvg} from "./MapSvg.tsx"

export const Map: FC = () => {
  const leftMouseMode = useSelector((state: RootState) => state.editor.leftMouseMode)
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode)
  const zoomInfo = useSelector((state: RootState) => state.editor.zoomInfo)
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { data } = useOpenWorkspaceQuery()
  const { mapId, colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()

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
    }}, [mapId]
  )

  return (
    <div
      style={{
        overflow: 'auto',
        display: 'grid',
        backgroundColor: getColors(colorMode).PAGE_BACKGROUND,
        gridTemplateRows: `100vh ${g.selfH}px 100vh`,
        gridTemplateColumns: `100vw ${g.selfW}px 100vw`,
        outline: 'none'
      }}
      ref={mainMapDiv}
      id={'mainMapDiv'}
      onMouseDown={(e) => {
        if (e.button === 1 && e.buttons === 4) {
          e.preventDefault()
        }
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          if (e.button === 0 && e.buttons === 1 && leftMouseMode !== LeftMouseMode.RECTANGLE_SELECT) {
            setScrollLeft(mainMapDiv.current!.scrollLeft - e.movementX)
            setScrollTop(document.documentElement.scrollTop - e.movementY)
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
        }, { signal })
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          resetView()
        }
      }}
      onWheel={(e) => {
        if (midMouseMode === MidMouseMode.ZOOM) {
          dispatch(actions.saveView({e}))
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
        <MapDivL/>
        <MapDivR/>
      </div>
      <div/>
      <div/>
      <div/>
    </div>
  )
}
