import React, {FC, Fragment, useState} from "react"
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {isChrome, isEqual} from "../core/Utils"
import {getColors} from "../core/Colors"
import {getNodeById, getNodeByPath} from "../core/MapUtils"
import {actions} from "../core/EditorReducer"
import {useOpenWorkspaceQuery} from "../core/Api"
import {
  getArcPath,
  getBezierLinePath,
  getBezierLinePoints,
  getCellPolygonPoints,
  getGridPath,
  getLinePathBetweenNodes,
  getPolygonPath,
  getStructPolygonPoints,
  getTaskCircle,
  getTaskPath,
} from "./MapSvgUtils"
import {getCoords} from "./MapDivUtils"
import {orient} from "../map/MapVisualizeHolderDiv"
import {mapAssembly} from "../map/MapAssembly"
import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState";

const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill'
  }
}

const getSourceNode = (n: N) => (n.type === 'cell' ? n.parentParentNodeId: n.parentNodeId)
const getSelectionMargin = (m: M, n: N) => (
  (
    ['c', 'cr', 'cc'].includes(m.g.sc.scope) ||
    (n.selection === 's' && (n.sBorderColor  || n.sFillColor)) ||
    (n.selection === 'f') ||
    n.taskStatus > 1 ||
    n.hasCell
  ) ? 4 : -2
)

const rectanglesIntersect = (input: number[]) => {
  const [minAx, minAy, maxAx, maxAy, minBx, minBy, maxBx, maxBy] = input
  return maxAx >= minBx && minAx <= maxBx && minAy <= maxBy && maxAy >= minBy
}

const getIntersectingNodes = (ml: N[], _fromCoords: {x: number, y: number}, _toCoords: {x: number, y: number}) => (
  ml.filter(n =>
    n.type === 'struct' &&
    !n.hasCell &&
    n.content !== '' &&
    +rectanglesIntersect([
      Math.min(_fromCoords.x, _toCoords.x),
      Math.min(_fromCoords.y, _toCoords.y),
      Math.max(_fromCoords.x, _toCoords.x),
      Math.max(_fromCoords.y, _toCoords.y),
      n.nodeStartX,
      n.nodeY,
      n.nodeEndX,
      n.nodeY,
    ])
  )
)

export const MapSvg: FC = () => {
  const mapListIndex = useSelector((state: RootStateOrAny) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tm = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const moveCoords = useSelector((state: RootStateOrAny) => state.editor.moveCoords)
  const ml = tm && Object.keys(tm).length ? tm : mapList[mapListIndex]
  const m = mapAssembly(ml) as M // TODO only pass g where only g is needed
  const pml = mapListIndex > 0 ? mapList[mapListIndex - 1] : ml // TODO ---> instead of this TERNARY, use mapListIndexBefore (TODO)
  const sn = ['c', 'cr', 'cc'].includes(m.g.sc.scope)
    ? getNodeByPath(ml, m.g.sc.sameParentPath)
    : ml
      .filter((el: any) => el.path.length > 1)
      .reduce((a: N, b: N) => a.selected > b.selected ? a : b)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const [selectionRectCoords, setSelectionRectCoords] = useState([] as number[])
  const [intersectingNodes, setIntersectingNodes] = useState([] as N[])
  const dispatch = useDispatch()
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 'calc(200vw + ' + m.g.mapWidth + 'px)',
        height: 'calc(200vh + ' + m.g.mapHeight + 'px)'
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        const fromCoords = getCoords(e)
        let didMove = false
        const abortController = new AbortController()
        const { signal } = abortController
        window.addEventListener('mousemove', (e) => {
          e.preventDefault()
          didMove = true
          if (e.buttons === 1) {
            const toCoords = getCoords(e)
            setSelectionRectCoords([
              Math.min(fromCoords.x, toCoords.x),
              Math.min(fromCoords.y, toCoords.y),
              Math.abs(toCoords.x - fromCoords.x),
              Math.abs(toCoords.y - fromCoords.y)
            ])
            setIntersectingNodes(getIntersectingNodes(ml, fromCoords, toCoords))
          } else if (e.buttons === 4) {
            const { movementX, movementY } = e
            orient(m, 'shouldScroll', { movementX, movementY })
          }
        }, { signal })
        window.addEventListener('mouseup', (e) => {
          e.preventDefault()
          abortController.abort()
          const toCoords = getCoords(e)
          if (didMove) {
            if (e.button === 0) {
              dispatch(actions.mapAction({
                type: 'select_dragged',
                payload: {nList: getIntersectingNodes(ml, fromCoords, toCoords)}
              }))
              setSelectionRectCoords([])
              setIntersectingNodes([])
            }
          } else {
            if (e.button === 0) {
              dispatch(actions.mapAction({type: 'select_R', payload: {}}))
            }
          }
        }, { signal })
      }}
      onDoubleClick={() => {
        orient(m, 'shouldCenter', {})
      }}
    >
      <svg
        style={{
          overflow: 'visible',
          transform: isChrome ? '' : 'translate(calc(100vw), calc(100vh))'}
        }
        x={isChrome? 'calc(100vw)' : ''}
        y={isChrome? 'calc(100vh)' : ''}
      >
        <g id="layer0">
          <rect
            key={`${m.g.nodeId}_svg_backgroundRect`}
            x={0}
            y={0}
            width={m.g.mapWidth}
            height={m.g.mapHeight}
            rx={32}
            ry={32}
            fill={C.MAP_BACKGROUND}
            style={{transition: '0.3s ease-out'}}
          >
          </rect>
        </g>
        <g id="layer1">
          {ml.map((n: N) => (
            <Fragment key={n.nodeId}>
              {
                n.fFillColor &&
                <path
                  key={`${n.nodeId}_svg_branchFill`}
                  d={getPolygonPath(n, getStructPolygonPoints(n, 'f'), 'f', 0)}
                  fill={n.fFillColor}
                  {...pathCommonProps}
                >
                </path>
              }
            </Fragment>
          ))}
        </g>
        <g id="layer2">
          {ml.map((n: N) => (
            <Fragment key={n.nodeId}>
              {
                (n.sFillColor || n.taskStatus > 1) &&
                <path
                  key={`${n.nodeId}_svg_nodeFill`}
                  d={getArcPath(n, -2, true)}
                  fill={n.taskStatus > 1 ? [C.TASK_FILL_1, C.TASK_FILL_2, C.TASK_FILL_3].at(n.taskStatus - 2) : n.sFillColor}
                  {...pathCommonProps}
                >
                </path>
              }
            </Fragment>
          ))}
        </g>
        <g id="layer3">
          {ml.map((n: N) => (
            <Fragment key={n.nodeId}>
              {
                n.fBorderColor &&
                <path
                  key={`${n.nodeId}_svg_branchBorder`}
                  d={getPolygonPath(n, getStructPolygonPoints(n, 'f'), 'f', 0)}
                  stroke={n.fBorderColor}
                  strokeWidth={n.fBorderWidth}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
              }
              {
                n.sBorderColor &&
                !n.hasCell &&
                <path
                  key={`${n.nodeId}_svg_nodeBorder`}
                  d={getArcPath(n, -2, true)}
                  stroke={n.sBorderColor}
                  strokeWidth={n.sBorderWidth}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
              }
              {
                !n.isRoot &&
                !n.isRootChild &&
                n.parentType !== 'cell' &&
                (
                  n.type === 'struct' && !n.hasCell ||
                  n.type === 'cell' && n.parentParentType !== 'cell' && n.index[0] > - 1 && n.index[1] === 0
                ) &&
                <path
                  key={`${n.nodeId}_svg_line`}
                  d={
                    !getNodeById(pml, n.nodeId) && getNodeById(pml, getSourceNode(n))
                      ? getLinePathBetweenNodes(getNodeById(pml, getSourceNode(n)), n)
                      : getLinePathBetweenNodes(getNodeById(ml, getSourceNode(n)), n)
                  }
                  strokeWidth={n.lineWidth}
                  stroke={n.taskStatus > 1 ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(n.taskStatus - 2) : n.lineColor}
                  fill={'none'}
                  {...pathCommonProps}
                >
                  {
                    !getNodeById(pml, n.nodeId) && getNodeById(pml, getSourceNode(n)) &&
                    <animate
                      attributeName='d'
                      from={getLinePathBetweenNodes(getNodeById(pml, getSourceNode(n)), n)}
                      to={getLinePathBetweenNodes(getNodeById(ml, getSourceNode(n)), n)}
                      dur={'0.3s'}
                      repeatCount={'once'}
                      fill={'freeze'}
                    >
                    </animate>
                  }
                </path>
              }
              {
                n.type === "struct" &&
                n.hasCell &&
                <path
                  key={`${n.nodeId}_svg_tableFrame`}
                  d={getArcPath(n, 0, false)}
                  stroke={n.sBorderColor ? n.sBorderColor : C.TABLE_FRAME_COLOR}
                  strokeWidth={n.sBorderWidth}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
              }
              {
                n.type === "struct" &&
                n.hasCell &&
                <path
                  key={`${n.nodeId}_svg_tableGrid`}
                  d={getGridPath(n)}
                  stroke={C.TABLE_GRID}
                  strokeWidth={1}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
              }
              {
                n.taskStatus > 0 &&
                !n.hasDir &&
                !n.hasStruct &&
                !n.hasCell &&
                !(n.contentType === 'image') &&
                !n.isRoot &&
                !n.isRootChild &&
                <Fragment key={`${n.nodeId}_svg_task`}>
                  {
                    !isEqual(n.nodeId, editedNodeId) &&
                    <path
                      key={`${n.nodeId}_svg_taskLine`}
                      d={getTaskPath(m, n)}
                      stroke={C.TASK_LINE}
                      strokeWidth={1}
                      fill={'none'}
                      {...pathCommonProps}
                    >
                    </path>
                  }
                  {
                    [...Array(m.g.taskConfigN)].map((el, i) => (
                      <circle
                        key={`${n.nodeId}_svg_taskCircle${i + 1}`}
                        id={'taskCircle'}
                        {...getTaskCircle(m, n, i)}
                        fill={n.taskStatus === i + 1
                          ? [C.TASK_CIRCLE_0_ON, C.TASK_CIRCLE_1_ON, C.TASK_CIRCLE_2_ON, C.TASK_CIRCLE_3_ON].at(i)
                          : [C.TASK_CIRCLE_0_OFF, C.TASK_CIRCLE_1_OFF, C.TASK_CIRCLE_2_OFF, C.TASK_CIRCLE_3_OFF].at(i)}
                        vectorEffect={'non-scaling-stroke'}
                        style={{
                          transition: '0.3s ease-out'
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          dispatch(actions.mapAction({type: 'setTaskStatus', payload: { taskStatus: i + 1, nodeId: n.nodeId }}))}
                        }
                      >
                      </circle>
                    ))
                  }
                </Fragment>
              }
            </Fragment>
          ))}
        </g>
        <g id="layer4">
          {ml.map((n: N) => (
            <Fragment key={n.nodeId}>
              {
                !selectionRectCoords.length &&
                n.selected &&
                n.selected !== m.g.sc.maxSel &&
                <path
                  key={`${n.nodeId}_svg_selectionBorderSecondary`}
                  d={getPolygonPath(n, getStructPolygonPoints(n, n.selection), n.selection, getSelectionMargin(m, n))}
                  stroke={C.SELECTION_COLOR}
                  strokeWidth={1}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
              }
            </Fragment>
          ))}
        </g>
        <g id="layer5">
          {
            !selectionRectCoords.length &&
            <path
              key={`${m.g.nodeId}_svg_selectionBorderPrimary`}
              d={getPolygonPath(
                sn,
                ['c', 'cr', 'cc'].includes(m.g.sc.scope) ? getCellPolygonPoints(sn, m.g.sc) : getStructPolygonPoints(sn, sn.selection),
                sn.selection,
                getSelectionMargin(m, sn)
              )}
              stroke={C.SELECTION_COLOR}
              strokeWidth={1}
              fill={'none'}
              {...pathCommonProps}
            >
            </path>
          }
        </g>
        <g id="layer6">
          {intersectingNodes.map((n: N) => (
            <Fragment key={n.nodeId}>
              <path
                key={`${m.g.nodeId}_svg_selectionByRect`}
                d={getPolygonPath(n, getStructPolygonPoints(n, 's'), 's', getSelectionMargin(m, n))}
                stroke={'#555555'}
                strokeWidth={1}
                fill={'none'}
                {...pathCommonProps}
              >
              </path>
            </Fragment>
          ))}
        </g>
        <g id="layer7">
          {
            selectionRectCoords.length &&
            <rect
              x={selectionRectCoords[0]}
              y={selectionRectCoords[1]}
              width={selectionRectCoords[2]}
              height={selectionRectCoords[3]}
              rx={8}
              ry={8}
              fill={C.SELECTION_RECT_COLOR}
              fillOpacity={0.05}
              strokeWidth={2}
            >
            </rect>
          }
        </g>
        <g id="layer8">
          {
            moveCoords.length &&
            <Fragment>
              <path
                key={`${m.g.nodeId}_svg_moveLine`}
                d={getBezierLinePath('M', getBezierLinePoints(moveCoords))}
                stroke={C.MOVE_LINE_COLOR}
                strokeWidth={1}
                fill={'none'}
              >
              </path>
              <rect
                x={moveCoords[2] - 10}
                y={moveCoords[3] - 10}
                width={20}
                height={20}
                rx={8}
                ry={8}
                fill={C.MAP_BACKGROUND}
                fillOpacity={1}
                stroke={C.MOVE_RECT_COLOR}
                strokeWidth={5}
              >
              </rect>
            </Fragment>
          }
        </g>
      </svg>
    </svg>
  )
}
