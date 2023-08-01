import React from "react"
import {adjustIcon} from "../core/Utils"
import {MapSvgIcon} from "./MapSvgIcons"

export const MapSvgIconWrapper = (
  {x, y, iconName, onMouseDownGuarded, onMouseUpGuarded=()=>{}}:
    {x: number, y: number, iconName: string, onMouseDownGuarded: Function, onMouseUpGuarded?: Function}) => (
  <g
    transform={`translate(${adjustIcon(x)}, ${adjustIcon(y)})`}
    {...{vectorEffect: 'non-scaling-stroke'}}
    style={{
      transition: 'all 0.3s',
      transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
      transitionProperty: 'all'
    }}
  >
    <g width="24" height="24" viewBox="0 0 24 24">
      <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
      <MapSvgIcon iconName={iconName}/>
      <rect
        width="24"
        height="24"
        style={{opacity: 0}}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onMouseDownGuarded(e)
        }}
        onMouseUp={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onMouseUpGuarded(e)
        }}
      />
    </g>
  </g>
)
