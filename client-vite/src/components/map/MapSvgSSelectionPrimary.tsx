import {FC, Fragment} from "react"
import {useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getG, getXA, getXS, isXS} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"
import {ContextMenu} from "@radix-ui/themes"

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
        <ContextMenu.Root>
          <g transform={`translate(${Math.round(xs.nodeStartX)}, ${Math.round(xs.nodeStartY)})`}>
            <ContextMenu.Trigger>
              <rect width={xs.selfW} height={xs.selfH} fill={'transparent'}/>
            </ContextMenu.Trigger>
            <ContextMenu.Content alignOffset={120}>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger>{'Select'}</ContextMenu.SubTrigger>
                <ContextMenu.SubContent>

                </ContextMenu.SubContent>
              </ContextMenu.Sub>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger>{'Insert'}</ContextMenu.SubTrigger>
                <ContextMenu.SubContent>

                </ContextMenu.SubContent>
              </ContextMenu.Sub>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger>{'Move'}</ContextMenu.SubTrigger>
                <ContextMenu.SubContent>

                </ContextMenu.SubContent>
              </ContextMenu.Sub>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger>{'Edit'}</ContextMenu.SubTrigger>
                <ContextMenu.SubContent>

                </ContextMenu.SubContent>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </g>
          )
        </ContextMenu.Root>
      }
    </Fragment>
  )
}
