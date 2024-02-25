import {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getG, getXC, isXACC, isXACR, isXC} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"
import {ContextMenu} from "@radix-ui/themes"
import {MR} from "../../reducers/MapReducerEnum.ts"

export const MapSvgCSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xc = getXC(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    !selectionRectCoords.length && (isXC(m) || isXACR(m) || isXACC(m)) &&
    <Fragment>
      <path
        key={`${g.nodeId}_svg_selectionBorderPrimary`}
        stroke={C.SELECTION_COLOR}
        strokeWidth={1}
        fill={'none'}{...pathCommonProps}
        d={getPolygonPath(m, xc, 'c', 4)}
      />
      <ContextMenu.Root onOpenChange={(value) => console.log('OPENNESS:', value /*TODO: set a redux variable, that removes map event listeners*/)}>
        <g transform={`translate(${Math.round(xc.nodeStartX)}, ${Math.round(xc.nodeStartY)})`}>
          <ContextMenu.Trigger>
            <rect width={xc.selfW} height={xc.selfH} fill={'transparent'}/>
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
                <ContextMenu.Item onClick={() => md(MR.insertSO)}>{'Struct Out'}</ContextMenu.Item>
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
      </ContextMenu.Root>
    </Fragment>
  )
}
