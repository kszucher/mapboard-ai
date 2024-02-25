import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getG, getXA, getXS, isXS} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"
import {DropdownMenu} from "@radix-ui/themes"
import Dots from "../../assets/dots.svg?react"

export const MapSvgSSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xs = getXS(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  return (
    isXS(m) && !selectionRectCoords.length &&
    <Fragment>
      {getXA(m).length === 1 && xs.selection === 's' && (xs.sBorderColor || xs.sFillColor || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', 2)}
        />
      }
      {getXA(m).length === 1 && xs.selection === 's' && !((xs.sBorderColor || xs.sFillColor) || xs.taskStatus > 1 || xs.co1.length) &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sSelf', -2)}
        />
      }
      {getXA(m).length === 1 && xs.selection === 'f' &&
        <path
          key={`${g.nodeId}_svg_selectionBorderPrimary`}
          stroke={C.SELECTION_COLOR}
          strokeWidth={1}
          fill={'none'}{...pathCommonProps}
          d={getPolygonPath(m, xs, 'sFamily', 4)}
        />
      }
      {
        getXA(m).length === 1 &&
        <DropdownMenu.Root>
          <g
            transform={`translate(${Math.round(xs.nodeStartX + xs.selfW + 12)}, ${Math.round(xs.nodeStartY + xs.selfH / 2 - 12)})`}
            style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}>
            <DropdownMenu.Trigger>
              <rect width={24} height={24} rx={20} ry={20} className={"fill-gray-500 hover:fill-teal-700"}/>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={() => console.log('x')}>
                {'Menu'}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
            <g className={"pointer-events-none"}>
              <Dots/>
            </g>
          </g>
          )
        </DropdownMenu.Root>
      }
    </Fragment>
  )
}
