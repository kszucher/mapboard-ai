import React from "react"
import {iconCommonProps} from "./MapSvg"
import {MapSvgIcon} from "./MapSvgIcons"

export const MapSvgIconWrapper = ({x, y, iconName, onMouseDownGuarded}: {x: number, y: number, iconName: string, onMouseDownGuarded: Function}) => (
  <g transform={`translate(${x}, ${y})`} {...iconCommonProps}>
    <g width="24" height="24" viewBox="0 0 24 24">
      <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
      <MapSvgIcon iconName={iconName}/>
      <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onMouseDownGuarded(e)
      }}
      />
    </g>
  </g>
)
