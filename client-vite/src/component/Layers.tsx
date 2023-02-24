import {FC, Fragment} from "react";
import {RootStateOrAny, useSelector} from "react-redux";
import {copy, isEqual} from "../core/Utils";
import {getColors} from "../core/Colors";
import {N} from "../types/DefaultProps";
import {getPolygonPath, getStructPolygonPoints} from "../core/SvgUtils";

export const Layers: FC = () => {
  const nodeList = useSelector((state: RootStateOrAny) => state.editor.nodeList)
  const nodeListSorted = (copy(nodeList)).sort((a: any, b: any) => (a.nodeId > b.nodeId) ? 1 : -1)
  const m = useSelector((state: RootStateOrAny) => state.editor.mapStackData[state.editor.mapStackDataIndex])
  const colorMode = 'dark'
  const {MAP_BACKGROUND} = getColors(colorMode)
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
                fill={MAP_BACKGROUND}
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
            {n.fFillColor && n.fFillColor !== '' &&
              <path
                key={`${n.nodeId}_svg_branchFill`}
                d={getPolygonPath(n, getStructPolygonPoints('f', n), 'f', 0)}
                fill={n.fFillColor}
                vectorEffect={'non-scaling-stroke'}
                style={{
                  transition: 'all 0.3s',
                  transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                  transitionProperty: 'd, fill'
                }}
              >
              </path>
            }
          </Fragment>
        ))}
      </g>
    </>
  )
}

// TODO: nodefill is next
