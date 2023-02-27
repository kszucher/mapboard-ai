import {FC, Fragment} from "react";
import {RootStateOrAny, useSelector} from "react-redux";
import {copy, isEqual} from "../core/Utils";
import {getColors} from "../core/Colors";
import {N} from "../types/DefaultProps";
import {getArcPath, getLinePath, getLinePoints, getPolygonPath, getStructPolygonPoints} from "../core/SvgUtils";
import {mapDisassembly} from "../map/MapDisassembly";

const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill'
  }
}

export const Layers: FC = () => {
  const m = useSelector((state: RootStateOrAny) => state.editor.mapStackData[state.editor.mapStackDataIndex])
  const nodeList = mapDisassembly.start(copy(m))
  const nodeListSorted = (copy(nodeList)).sort((a: any, b: any) => (a.nodeId > b.nodeId) ? 1 : -1)
  const colorMode = 'dark'
  const C = getColors(colorMode)
  return (
    <>
      <g id="layer0">
        {nodeListSorted.map((n: N) => (
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
        {nodeListSorted.map((n: N) => (
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
        {nodeListSorted.map((n: N) => (
          <Fragment key={n.nodeId}>
            {(n.sFillColor && n.sFillColor !== '' || n.taskStatus > 1) &&
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
        {nodeListSorted.map((n: N) => (
          <Fragment key={n.nodeId}>
            {(n.fBorderColor && n.fBorderColor !== '') &&
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
            {(n.sBorderColor && n.sBorderColor !== '' && !n.hasCell) &&
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
                d={n.animationRequested
                  ? getLinePath(n, getLinePoints(n, true))
                  : getLinePath(n, getLinePoints(n, false))
                }
                strokeWidth={n.lineWidth}
                stroke={n.taskStatus > 1 ? [C.TASK_LINE_1, C.TASK_LINE_2, C.TASK_LINE_3].at(n.taskStatus - 2) : n.lineColor}
                fill={'none'}
                {...pathCommonProps}
              >
                {n.animationRequested &&
                  <animate
                    attributeName='d'
                    from={getLinePath(n, getLinePoints(n, true))}
                    to={getLinePath(n, getLinePoints(n, false))}
                    dur={'0.3s'}
                    repeatCount={'once'}
                    fill={'freeze'}
                  >
                  </animate>
                }
              </path>
            }
          </Fragment>
        ))}
      </g>
    </>
  )
}

// TODO: tableFrame, tableGrid,
