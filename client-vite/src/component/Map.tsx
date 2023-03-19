import React, {FC} from "react"
import {MapSvg} from "./MapSvg"
import {MapDiv} from "./MapDiv"

export const Map: FC = () => {
  return (
    <div
      id='mapDivOuter'
      style={{
        overflowY: 'scroll',
        overflowX: 'scroll'
      }}>
      <div
        id='mapDivInner'
        style={{
          position: 'relative',
          paddingTop: '100vh',
          paddingLeft: '100vw',
        }}>
        <MapSvg/>
        <MapDiv/>
      </div>
    </div>
  )
}
