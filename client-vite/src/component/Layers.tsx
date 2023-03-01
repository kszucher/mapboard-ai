import {FC, Fragment} from "react";
import {RootStateOrAny, useSelector} from "react-redux";
import {copy, isEqual} from "../core/Utils";
import {getColors} from "../core/Colors";
import {M, N} from "../types/DefaultProps";
import {
  getArcPath,
  getGridPath,
  getLinePath,
  getPolygonPath,
  getStructPolygonPoints,
  getTaskCircle,
  getTaskPath
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
const m2ml = (m: M): N[] => ((copy(mapDisassembly.start(copy(m)))).sort((a: any, b: any) => (a.nodeId > b.nodeId) ? 1 : -1))

export const Layers: FC = () => {
  const mdi = useSelector((state: RootStateOrAny) => state.editor.mapStackDataIndex)
  const md = useSelector((state: RootStateOrAny) => state.editor.mapStackData)
  const m = md[mdi]
  const ml = m2ml(m)
  const pm = mdi > 0 ? md[mdi - 1] : {} // TODO handle tm AND undo-redo
  const pml = mdi > 0 ? m2ml(pm) : []
  const colorMode = 'dark'
  const C = getColors(colorMode)
  return (
    <>
      <g id="layer0">
        {ml.map((n: N) => (
          <Fragment key={n.nodeId}>
            {isEqual(n.path, ['g']) &&
              <rect
                key={`${n.nodeId}_svg_backgroundRect`}
                x={0}
                y={0}
                width={m.g.mapWidth}
                height={m.g.mapHeight}
                rx={32}
                ry={32}
                fill={C.MAP_BACKGROUND}
                style={{
                  transition: '0.3s ease-out'
                }}
              >
              </rect>
            }
          </Fragment>
        ))}
      </g>
      <g id="layer1">
        {ml.map((n: N) => (
          <Fragment key={n.nodeId}>
            {(n.fFillColor && n.fFillColor !== '') &&
              <path
                key={`${n.nodeId}_svg_branchFill`}
                d={getPolygonPath(n, getStructPolygonPoints('f', n), 'f', 0)}
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
              (n.sFillColor && n.sFillColor !== '' || n.taskStatus > 1) &&
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
              (n.fBorderColor && n.fBorderColor !== '') &&
              <path
                key={`${n.nodeId}_svg_branchBorder`}
                d={getPolygonPath(n, getStructPolygonPoints('f', n), 'f', 0)}
                stroke={n.fBorderColor}
                strokeWidth={n.fBorderWidth}
                fill={'none'}
                {...pathCommonProps}
              >
              </path>
            }
            {
              (n.sBorderColor && n.sBorderColor !== '' && !n.hasCell) &&
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
              (
                !n.isRoot &&
                !n.isRootChild &&
                n.parentType !== 'cell' &&
                (
                  n.type === 'struct' && !n.hasCell ||
                  n.type === 'cell' && n.parentParentType !== 'cell' && n.index[0] > - 1 && n.index[1] === 0
                )
              ) &&
              <path
                key={`${n.nodeId}_svg_line`}
                d={
                  !getNodeById(pml, n.nodeId) && getNodeById(pml, n.parentNodeId)
                    ? getLinePath(getNodeById(pml, n.parentNodeId), n)
                    : getLinePath(getNodeById(ml, n.parentNodeId), n)
                }
                strokeWidth={n.lineWidth}
                stroke={n.taskStatus > 1 ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(n.taskStatus - 2) : n.lineColor}
                fill={'none'}
                {...pathCommonProps}
              >
                {
                  !getNodeById(pml, n.nodeId) && getNodeById(pml, n.parentNodeId) &&
                  <animate
                    attributeName='d'
                    from={getLinePath(getNodeById(pml, n.parentNodeId), n)}
                    to={getLinePath(getNodeById(ml, n.parentNodeId), n)}
                    dur={'0.3s'}
                    repeatCount={'once'}
                    fill={'freeze'}
                  >
                  </animate>
                }
              </path>
            }
            {
              (n.type === "struct" && n.hasCell) &&
              <path
                key={`${n.nodeId}_svg_tableFrame`}
                d={getArcPath(n, 0, false)}
                stroke={n.sBorderColor === '' ? C.TABLE_FRAME_COLOR : n.sBorderColor}
                strokeWidth={n.sBorderWidth}
                fill={'none'}
                {...pathCommonProps}
              >
              </path>
            }
            {
              (n.type === "struct" && n.hasCell) &&
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
              (
                !(n.path.length === 1) && // is 'g'
                n.taskStatus !== 0 &&
                !n.hasDir &&
                !n.hasStruct &&
                !n.hasCell &&
                n.contentType !== 'image' &&
                !n.isRoot &&
                !n.isRootChild
              ) &&
              <Fragment key={`${n.nodeId}_svg_task`}>
                {/*!isEqual(n.path, editedPath)*/}
                <path
                  key={`${n.nodeId}_svg_taskLine`}
                  d={getTaskPath(m, n)}
                  stroke={C.TASK_LINE}
                  strokeWidth={1}
                  fill={'none'}
                  {...pathCommonProps}
                >
                </path>
                {
                  [...Array(m.g.taskConfigN)].map((el, i) => (
                    <circle
                      key={`${n.nodeId}_svg_taskCircle${i + 1}`}
                      id={`${n.nodeId}_svg_taskCircle${i + 1}`}
                      {...getTaskCircle(m, n, i)}
                      fill={n.taskStatus === i + 1
                        ? [C.TASK_CIRCLE_0_ACTIVE, C.TASK_CIRCLE_1_ACTIVE, C.TASK_CIRCLE_2_ACTIVE, C.TASK_CIRCLE_3_ACTIVE].at(i)
                        : [C.TASK_CIRCLE_0_INACTIVE, C.TASK_CIRCLE_1_INACTIVE, C.TASK_CIRCLE_2_INACTIVE, C.TASK_CIRCLE_3_INACTIVE].at(i)}
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
            {

            }
          </Fragment>
        ))}
      </g>
    </>
  )
}

// TODO: all kinds of selections
