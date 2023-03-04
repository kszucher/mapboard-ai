import {FC, Fragment} from "react";
import {RootStateOrAny, useSelector} from "react-redux";
import {copy, isEqual} from "../core/Utils";
import {getColors} from "../core/Colors";
import {M, N} from "../types/DefaultProps";
import {
  getBezierLinePath,
  getBezierLinePoints,
  getLinePathBetweenNodes,
  getStructPolygonPoints,
  getCellPolygonPoints,
  getPolygonPath,
  getArcPath,
  getGridPath,
  getTaskPath,
  getTaskCircle,
} from "../core/SvgUtils";
import {mapDisassembly} from "../map/MapDisassembly";

const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill'
  }
}

const getNodeById = (ml: N[], nodeId: string) => (ml.find((n: N) => n.nodeId === nodeId) as N)
const getNodeByPath = (ml: N[], path: any[]) => (ml.find((n: N) => isEqual(n.path, path)) as N)
const getSourceNode = (n: N) => (n.type === 'cell' ? n.parentParentNodeId: n.parentNodeId)
const m2ml = (m: M) => (
  mapDisassembly.start(copy(m))
    .sort((a: any, b: any) => (a.nodeId > b.nodeId) ? 1 : -1)
    .filter((el: any) => el.path.length > 1)
)
const getSelectionMargin = (m: M, n: N) => (
  (
    ['c', 'cr', 'cc'].includes(m.g.sc.scope) ||
    (n.selection === 's' && (n.sBorderColor  || n.sFillColor)) ||
    (n.selection === 'f') ||
    n.taskStatus > 1 ||
    n.hasCell
  ) ? 4 : -2
)

export const Layers: FC = () => {
  const colorMode = 'dark'
  const C = getColors(colorMode)
  const mdi = useSelector((state: RootStateOrAny) => state.editor.mapStackDataIndex)
  const md = useSelector((state: RootStateOrAny) => state.editor.mapStackData)
  const m = md[mdi]
  const ml = m2ml(m)
  const pm = mdi > 0 ? md[mdi - 1] : {} // TODO handle tm AND undo-redo
  const pml = mdi > 0 ? m2ml(pm) : []
  const sn = ['c', 'cr', 'cc'].includes(m.g.sc.scope)
    ? getNodeByPath(ml, m.g.sc.sameParentPath)
    : (ml.reduce((a: N, b: N) => a.selected > b.selected ? a : b))
  const editedNodeId = useSelector((state: RootStateOrAny) => state.editor.editedNodeId)
  const moveTarget = useSelector((state: RootStateOrAny) => state.editor.moveTarget)
  const selectTarget = useSelector((state: RootStateOrAny) => state.editor.selectTarget)

  return (
    <>
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
              n.path.length > 1 &&
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
                      id={`${n.nodeId}_svg_taskCircle${i + 1}`}
                      {...getTaskCircle(m, n, i)}
                      fill={n.taskStatus === i + 1
                        ? [C.TASK_CIRCLE_0_ON, C.TASK_CIRCLE_1_ON, C.TASK_CIRCLE_2_ON, C.TASK_CIRCLE_3_ON].at(i)
                        : [C.TASK_CIRCLE_0_OFF, C.TASK_CIRCLE_1_OFF, C.TASK_CIRCLE_2_OFF, C.TASK_CIRCLE_3_OFF].at(i)}
                      vectorEffect={'non-scaling-stroke'}
                      style={{
                        transition: '0.3s ease-out'
                      }}
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
              n.selected &&
              n.selected !== m.g.sc.maxSel &&
              <path
                key={`${n.nodeId}_svg_selectionBorderSecondary`}
                d={getPolygonPath(
                  n,
                  getStructPolygonPoints(n, n.selection),
                  n.selection,
                  getSelectionMargin(m, n)
                )}
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
          <path
            key={`${m.g.nodeId}_svg_selectionBorderPrimary`}
            d={getPolygonPath(
              sn,
              ['c', 'cr', 'cc'].includes(m.g.sc.scope)
                ? getCellPolygonPoints(sn, m.g.sc)
                : getStructPolygonPoints(sn, sn.selection)
              ,
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
        {
          moveTarget?.moveData?.length && // TODO use draggedNodeId instead
          <Fragment>
            <path
              key={`${m.g.nodeId}_svg_moveLine`}
              d={getBezierLinePath('M', getBezierLinePoints(moveTarget.moveData))}
              stroke={C.MOVE_LINE_COLOR}
              strokeWidth={1}
              fill={'none'}
            >
            </path>
            <rect
              x={moveTarget.moveData[2] - 10}
              y={moveTarget.moveData[3] - 10}
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
      <g id="layer7">
        {
          selectTarget?.selectionRect?.length &&
          <rect
            x={selectTarget.selectionRect[0]}
            y={selectTarget.selectionRect[1]}
            width={selectTarget.selectionRect[2]}
            height={selectTarget.selectionRect[3]}
            rx={8}
            ry={8}
            fill={C.SELECTION_RECT_COLOR}
            fillOpacity={0.05}
            strokeWidth={2}
          >
          </rect>
        }
      </g>
    </>
  )
}
