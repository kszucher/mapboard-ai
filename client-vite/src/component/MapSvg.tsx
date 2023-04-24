import React, {FC, Fragment, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {isChrome} from "../core/Utils"
import {getColors} from "../core/Colors"
import {getSI1, getG, getX, getNodeById, getNodeByPath, getPattern, isXCC, isXCR, isXC, isS} from "../map/MapUtils"
import {actions, RootState} from "../editor/EditorReducer"
import {useOpenWorkspaceQuery} from "../core/Api"
import {getArcPath, getBezierLinePath, getBezierLinePoints, getCellPolygonPoints, getGridPath, getLinePathBetweenNodes, getPolygonPath, getStructPolygonPoints, getTaskCircle, getTaskPath,} from "./MapSvgUtils"
import {getCoords} from "./MapDivUtils"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mapFindIntersecting} from "../map/MapFindIntersecting";
import isEqual from "react-fast-compare";
import {M, N} from "../state/MapPropTypes";

const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width'
  }
}

const getSelectionMargin = (m: M, n: N) => (
  (
    isXC(m) ||
    isXCR(m) ||
    isXCC(m) ||
    (n.selection === 's' && (n.sBorderColor  || n.sFillColor)) ||
    (n.selection === 'f') ||
    n.taskStatus > 1 ||
    (n.cRowCount || n.cColCount)
  ) ? 4 : -2
)

export const MapSvg: FC = () => {
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const tm = useSelector((state: RootState) => state.editor.tempMap)
  const editedNodeId = useSelector((state: RootState) => state.editor.editedNodeId)
  const moveCoords = useSelector((state: RootState) => state.editor.moveCoords)
  const m = tm.length ? tm : mapList[mapListIndex]
  const g = getG(m)
  const ls = getX(m)
  const pm = mapListIndex > 0 ? mapList[mapListIndex - 1] : m // TODO ---> instead of this TERNARY, use mapListIndexBefore (TODO)
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
        width: 'calc(200vw + ' + g.mapWidth + 'px)',
        height: 'calc(200vh + ' + g.mapHeight + 'px)'
      }}
      onMouseDown={(e) => {
        if (e.button === 1) {
          e.preventDefault()
        }
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
            setIntersectingNodes(mapFindIntersecting(m, fromCoords, toCoords))
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
                payload: {nList: mapFindIntersecting(m, fromCoords, toCoords)}
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
            key={`${g.nodeId}_svg_backgroundRect`}
            x={0}
            y={0}
            width={g.mapWidth}
            height={g.mapHeight}
            rx={32}
            ry={32}
            fill={C.MAP_BACKGROUND}
            style={{transition: '0.3s ease-out'}}
          >
          </rect>
        </g>
        <g id="layer1">
          {m.map((n: N) => (
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
          {m.map((n: N) => (
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
          {m.map((n: N) => (
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
                n.sBorderColor && !n.cRowCount && !n.cColCount &&
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
                (getPattern(n.path).endsWith('ds') ||
                getPattern(n.path).endsWith('ss') ||
                (getPattern(n.path).endsWith('dsc') || getPattern(n.path).endsWith('ssc')) && n.path.at(-2) as number > -1 && n.path.at(-1) === 0) &&
                <path
                  key={`${n.nodeId}_svg_line`}
                  d={
                    !getNodeById(pm, n.nodeId) && getNodeByPath(pm, getSI1(n.path))
                      ? getLinePathBetweenNodes(getNodeByPath(pm, getSI1(n.path)), n)
                      : getLinePathBetweenNodes(getNodeByPath(m, getSI1(n.path)), n)
                  }
                  strokeWidth={n.lineWidth}
                  stroke={n.taskStatus > 1 ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(n.taskStatus - 2) : n.lineColor}
                  fill={'none'}
                  {...pathCommonProps}
                >
                  {
                    !getNodeById(pm, n.nodeId) && getNodeByPath(pm, getSI1(n.path)) &&
                    <animate
                      attributeName='d'
                      from={getLinePathBetweenNodes(getNodeByPath(pm, getSI1(n.path)), n)}
                      to={getLinePathBetweenNodes(getNodeByPath(m, getSI1(n.path)), n)}
                      dur={'0.3s'}
                      repeatCount={'once'}
                      fill={'freeze'}
                    >
                    </animate>
                  }
                </path>
              }
              {
                isS(n.path) && (n.cRowCount || n.cColCount) &&
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
                isS(n.path) && (n.cRowCount || n.cRowCount) &&
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
                n.taskStatus > 0 && !n.dCount && !n.sCount && !n.cRowCount && !n.cColCount && n.contentType !== 'image' &&
                <Fragment key={`${n.nodeId}_svg_task`}>
                  {
                    !isEqual(n.nodeId, editedNodeId) &&
                    <path
                      key={`${n.nodeId}_svg_taskLine`}
                      d={getTaskPath(m, g, n)}
                      stroke={C.TASK_LINE}
                      strokeWidth={1}
                      fill={'none'}
                      {...pathCommonProps}
                    >
                    </path>
                  }
                  {
                    [...Array(g.taskConfigN)].map((el, i) => (
                      <circle
                        key={`${n.nodeId}_svg_taskCircle${i + 1}`}
                        id={'taskCircle'}
                        {...getTaskCircle(m, g, n, i)}
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
          {m.map((n: N) => (
            <Fragment key={n.nodeId}>
              {
                !selectionRectCoords.length &&
                n.selected &&
                n.selected !== ls.selected &&
                !isXCR(m) &&
                !isXCC(m) &&
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
              key={`${g.nodeId}_svg_selectionBorderPrimary`}
              d={
                getPolygonPath(ls,
                  (isXC(m) || isXCR(m) || isXCC(m))
                    ? getCellPolygonPoints(m)
                    : getStructPolygonPoints(ls, ls.selection), ls.selection,
                  getSelectionMargin(m, ls)
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
          {intersectingNodes.map(n => (
            <Fragment key={n.nodeId}>
              <path
                key={`${g.nodeId}_svg_selectionByRect`}
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
                key={`${g.nodeId}_svg_moveLine`}
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
