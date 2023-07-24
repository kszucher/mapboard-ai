import React, {FC, useEffect, useRef, useState} from "react"
import {RootState} from "../core/EditorReducer"
import {mSelector} from "../state/EditorState"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"
import {useSelector} from "react-redux"
import {getMapX, getMapY, scrollTo} from "./MapDivUtils"
import {useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {getG} from "../core/MapUtils"
import {G, N} from "../state/MapPropTypes"

const getScrollLeft = (g: G) => (window.innerWidth + g.mapWidth) / 2
const getScrollTop = (g: G) => (window.innerHeight - g.mapHeight) / 2

const setScrollX = (x: number) => document.getElementById('mainMapDiv')!.scrollLeft -= x
const setScrollY = (y: number) => window.scrollTo(0, document.documentElement.scrollTop - y)

const zoomIntensity = 0.2;

export const Map: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { density, alignment } = g
  const { data } = useOpenWorkspaceQuery()
  const { mapId, frameId } = data || defaultUseOpenWorkspaceQueryState
  const mainMapDiv = useRef<HTMLDivElement>(null)

  const [scale, setScale] = useState(1)
  const [xLast, setXLast] = useState(0)
  const [yLast, setYLast] = useState(0)
  const [xNew, setXNew] = useState(0)
  const [yNew, setYNew] = useState(0)
  const [xImage, setXImage] = useState(0)
  const [yImage, setYImage] = useState(0)


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
      // mainMapDiv.current.scrollLeft = getScrollLeft(g)
      // mainMapDiv.current.scrollTop = 10

      // mainMapDiv.current.scrollTop = getScrollTop(g)


      window.scrollTo(
        // document.documentElement.scrollLeft - e.movementX,
        // document.documentElement.scrollTop - e.movementY
      )


    }}, [mapId, frameId]
  )

  useEffect(() => {
    if (mainMapDiv.current) {
      scrollTo(getScrollLeft(g), 500)
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
          setScrollX(e.movementX)
          setScrollY(e.movementY)
        }
      }}
      onDoubleClick={() => {
        if (mainMapDiv.current) {
          scrollTo(getScrollLeft(g), 500)
        }
      }}
      onWheel={(e) => {
        const mapX = getMapX(e)
        const mapY = getMapY(e)
        const newXImage = xImage + ((mapX - xLast) / scale)
        const newYImage = yImage + ((mapY - yLast) / scale)

        // TODO BRING THE EXPONENTIAL FROM THE OTHER ANSWER AND WE'LL BE GOOD

        let newScale
        if (e.deltaY > 0)
        {
          newScale = (scale - 0.1)
        }
        else
        {
          newScale = (scale + 0.1)
        }
        setXNew((mapX - newXImage) / newScale)
        setYNew((mapY - newYImage) / newScale)
        setScale(newScale)
        setXImage(newXImage)
        setYImage(newYImage)
        setXLast(mapX)
        setYLast(mapY)
      }}
    >
      <div/>
      <div/>
      <div/>
      <div/>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          transform: `scale(${scale}) translate(${xNew}px, ${yNew}px)`,
          transformOrigin: `${xImage}px ${yImage}px`
        }}
      >
        <MapSvg/>
        <MapDiv/>
      </div>
      <div/>
      <div/>
      <div/>
    </div>
  )
}
