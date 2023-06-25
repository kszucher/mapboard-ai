import React from "react";

const svgCommonParams = {
  viewBox:"0 0 480 480",
  width:"24px",
  height:"24px"

}
const sSelectionSvg = "M 120 144 L 360 144 C 408 144 432 168 432 216 L 432 264 C 432 312 408 336 360 336 L 120 336 C 72 336 48 312 48 264 C 48 216 48 264 48 216 C 48 168 72 144 120 144 Z"
const fSelectionSvg = "M 312 72 L 360 72 C 408 72 432 96 432 144 L 432 336 C 432 384 408 408 360 408 L 312 408 C 264 408 120 312 72 312 C 24 312 24 168 72 168 C 120 168 264 72 312 72 Z"

export const LineIcon = () => (
  <svg {...svgCommonParams}>
    <path style={{ fill: 'none', stroke: 'var(--main-color)', strokeWidth:24 }}
          d="M 408 72 C 72 72 408 408 72 408"
    />
  </svg>
)

export const BorderIcon = ({selection} : {selection: any}) => (
  <svg {...svgCommonParams}>
    <path style={{ fill: 'none', stroke: 'var(--main-color)', strokeWidth:24 }}
          d={selection === 's' ? sSelectionSvg : fSelectionSvg}
    />
  </svg>
)

export const FillIcon = ({selection} : {selection: any}) => (
  <svg {...svgCommonParams}>
    <path style={{ fill: 'var(--main-color)', stroke: 'var(--main-color)', strokeWidth:24 }}
          d={selection === 's' ? sSelectionSvg : fSelectionSvg}
    />
  </svg>
)

export const TextIcon = () => (
  <svg {...svgCommonParams}>
    <g>
      <line style={{ fill: 'var(--main-color)', stroke: 'var(--main-color)', strokeWidth:24 }} x1={96} y1={96} x2={384} y2={96}/>
      <line style={{ fill: 'var(--main-color)', stroke: 'var(--main-color)', strokeWidth:24 }} x1={240} y1={384} x2={240} y2={96}/>
    </g>
  </svg>
)

export const TaskIcon = () => (
  <svg {...svgCommonParams}>
    <g>
      <ellipse style={{ fill: 'none', stroke: 'var(--main-color)', strokeWidth:24 }} cx={120} cy={240} rx={80} ry={80}/>
      <ellipse style={{ fill: 'var(--main-color)', stroke: 'var(--main-color)', strokeWidth:24 }} cx={360} cy={240} rx={80} ry={80}/>
    </g>
  </svg>
)

export const CreateMapInMapIcon = () => (
  <svg {...svgCommonParams}>
    <g>
      <path style={{ fill: 'none', stroke: 'var(--main-color)', strokeWidth:48 }} d="M 48 96 L 144 240 L 48 384"/>
      <path style={{ fill: 'var(--main-color)', stroke: 'var(--main-color)', strokeWidth:48 }} d="M 432 240 L 240 240"/>
      <path style={{ fill: 'var(--main-color)', stroke: 'var(--main-color)', strokeWidth:48 }} d="M 336 144 L 336 336"/>
    </g>
  </svg>
)
