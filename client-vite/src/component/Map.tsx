import React, {FC, useEffect, useRef, useState} from "react"
import {RootState} from "../core/EditorReducer"
import {mSelector} from "../state/EditorState"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"
import {useSelector} from "react-redux"
import {getCoords, scrollTo} from "./MapDivUtils"
import {useOpenWorkspaceQuery} from "../core/Api"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {getG} from "../core/MapUtils"
import {G, N} from "../state/MapPropTypes"

const getScrollLeft = (g: G) => (window.innerWidth + g.mapWidth) / 2
const getScrollTop = (g: G) => (window.innerHeight - g.mapHeight) / 2

const getScrollX = () => document.getElementById('mainMapDiv')!.scrollLeft
const getScrollY = () => document.documentElement.scrollTop

// const getMapX = () => e.pageX - window.innerWidth + document.getElementById('mainMapDiv')!.scrollLeft

const setScrollX = (x: number) => document.getElementById('mainMapDiv')!.scrollLeft -= x
const setScrollY = (y: number) => window.scrollTo(0, document.documentElement.scrollTop - y)

// export const getCoords = (e: any) => {
//   const winWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
//   const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
//   const mainMapDiv = document.getElementById('mainMapDiv') as HTMLDivElement
//   return {
//     x:  e.pageX - winWidth + mainMapDiv.scrollLeft,
//     y: e.pageY - winHeight + mainMapDiv.scrollTop
//   }
// }
const width = window.innerWidth;
const height = window.innerHeight;

var scale = 1;  // scale of the image
var xLast = 0;  // last x location on the screen
var yLast = 0;  // last y location on the screen
var xImage = 0; // last x location on the image
var yImage = 0; // last y location on the image

const zoomIntensity = 0.2;

export const Map: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const { density, alignment } = g
  const { data } = useOpenWorkspaceQuery()
  const { mapId, frameId } = data || defaultUseOpenWorkspaceQueryState
  const mainMapDiv = useRef<HTMLDivElement>(null)

  const [scaleFactor, setScaleFactor] = useState(1)

  const [originX, setOriginX] = useState(0)
  const [originY, setOriginY] = useState(0)

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
        const subMapDiv = document.getElementById('subMapDiv') as HTMLDivElement


        // find current location on screen

        const xy = getCoords(e)

        var xScreen =xy.x
        var yScreen =xy.y

        // find current location on the image at the current scale
        xImage = xImage + ((xScreen - xLast) / scale);
        yImage = yImage + ((yScreen - yLast) / scale);

        // TODO BRING THE EXPONENTIAL FROM THE OTHER ANSWER AND WE'LL BE GOOD

        // determine the new scale
        if (e.deltaY > 0)
        {
          scale -= 0.1;
        }
        else
        {
          scale += 0.1;
        }
        // scale = scale < 1 ? 1 : (scale > 64 ? 64 : scale);

        // determine the location on the screen at the new scale
        var xNew = (xScreen - xImage) / scale;
        var yNew = (yScreen - yImage) / scale;

        // save the current screen location
        xLast = xScreen;
        yLast = yScreen;


        // const subMapDiv = document.getElementById('subMapDiv') as HTMLDivElement
        subMapDiv.style.transform = 'scale(' + scale + ')' + 'translate(' + xNew + 'px, ' + yNew + 'px' + ')'
        subMapDiv.style.transformOrigin = xImage + 'px ' + yImage + 'px'


      }}
    >
      <div/>
      <div/>
      <div/>
      <div/>
      <div

        id={'subMapDiv'}

        style={{

        position: 'relative',
        display: 'flex',
        // transform: `scale(${scaleFactor})`,
        // transformOrigin: `${originX}px ${originY}px`

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
