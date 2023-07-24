import React, {FC, useEffect, useRef, useState} from "react"
import {RootState} from "../core/EditorReducer"
import {mSelector} from "../state/EditorState"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"
import {useSelector} from "react-redux"
import {getMapX, getMapY, setScrollLeftAnimated} from "./MapDivUtils"
import {useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {getG} from "../core/MapUtils"

const ZOOM_INTENSITY = 0.2

export const Map: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { density, alignment } = g
  const { data } = useOpenWorkspaceQuery()
  const { mapId, frameId } = data || defaultUseOpenWorkspaceQueryState

  const [xLast, setXLast] = useState(0)
  const [yLast, setYLast] = useState(0)
  const [xNew, setXNew] = useState(0)
  const [yNew, setYNew] = useState(0)
  const [xImage, setXImage] = useState(0)
  const [yImage, setYImage] = useState(0)
  const [scale, setScale] = useState(1)

  const resetView = () => {
    setXLast(0)
    setYLast(0)
    setXNew(0)
    setYNew(0)
    setXImage(0)
    setYImage(0)
    setScale(1)
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
    }}, [density, alignment] // TODO figure out how to react to the end of moveTarget
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
        const mapX = getMapX(e)
        const mapY = getMapY(e)
        const newXImage = xImage + ((mapX - xLast) / scale)
        const newYImage = yImage + ((mapY - yLast) / scale)
        let newScale = scale * Math.exp((e.deltaY < 0 ? 1 : -1) * ZOOM_INTENSITY)
        if (newScale > 20) {newScale = 20}
        if (newScale < 0.2) {newScale = 0.2}
        setXLast(mapX)
        setYLast(mapY)
        setXNew((mapX - newXImage) / newScale)
        setYNew((mapY - newYImage) / newScale)
        setXImage(newXImage)
        setYImage(newYImage)
        setScale(newScale)
      }}
    >
      <div/>
      <div/>
      <div/>
      <div/>
      <div style={{position: 'relative', display: 'flex', transform: `scale(${scale}) translate(${xNew}px, ${yNew}px)`, transformOrigin: `${xImage}px ${yImage}px`}}>
        <MapSvg/>
        <MapDiv/>
      </div>
      <div/>
      <div/>
      <div/>
    </div>
  )
}
