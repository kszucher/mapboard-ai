import React from "react"
import {M} from "../state/MapPropTypes"
import {MapSvgIcon} from "./MapSvgIcons"

export const MapSvgIconWrapper = ({m, iconName, onMouseDownGuarded}: {m: M, iconName: string, onMouseDownGuarded: Function}) => (
  <g width="24" height="24" viewBox="0 0 24 24">
    <rect width="24" height="24" rx={4} ry={4} fill={'#444444'}/>
    <MapSvgIcon iconName={iconName}/>
    <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onMouseDownGuarded(e)
    }}
    />
  </g>
)
