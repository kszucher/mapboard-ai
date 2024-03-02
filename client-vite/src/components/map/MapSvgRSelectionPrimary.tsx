import {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import { useOpenWorkspaceQuery} from "../../api/Api.ts"
import {getColors} from "../assets/Colors"
import {getG, getXAR, getXR, isXAR,} from "../../queries/MapQueries.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {mSelector} from "../../state/EditorState"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getPolygonPath, pathCommonProps} from "./MapSvgUtils"
import {ContextMenu} from "@radix-ui/themes"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {ControlType} from "../../state/Enums.ts"

export const MapSvgRSelectionPrimary: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const g = getG(m)
  const xr = getXR(m)
  const selectionRectCoords = useSelector((state: RootState) => state.editor.selectionRectCoords)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const C = getColors(colorMode)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    isXAR(m) && getXAR(m).length === 1 && !selectionRectCoords.length &&
    <Fragment>
      <path
        key={`${g.nodeId}_svg_selectionBorderPrimary`}
        stroke={C.SELECTION_COLOR}
        strokeWidth={1}
        fill={'none'}{...pathCommonProps}
        d={getPolygonPath(m, getXR(m), 'sSelf', -2)}
      />
      <ContextMenu.Root onOpenChange={(value) => console.log('OPENNESS:', value /*TODO: set a redux variable, that removes map event listeners*/)}>
        <g transform={`translate(${Math.round(xr.nodeStartX)}, ${Math.round(xr.nodeStartY)})`}>
          <ContextMenu.Trigger>
            <rect width={xr.selfW} height={xr.selfH} fill={'transparent'}/>
          </ContextMenu.Trigger>
          <ContextMenu.Content alignOffset={120}>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>{'Select'}</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                <ContextMenu.Item onClick={() => md(MR.selectRA)}>{'All Root'}</ContextMenu.Item>
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>{'Insert'}</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                <ContextMenu.Item onClick={() => md(MR.insertR)}>{'Root Out'}</ContextMenu.Item>
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
                {getXR(m).controlType !== ControlType.NONE && <ContextMenu.Item onClick={() => md(MR.setControlTypeNone)}>{'Control Type None'}</ContextMenu.Item>}
                {getXR(m).controlType !== ControlType.INGESTION && <ContextMenu.Item onClick={() => md(MR.setControlTypeIngestion)}>{'Control Type Ingestion'}</ContextMenu.Item>}
                {getXR(m).controlType !== ControlType.EXTRACTION && <ContextMenu.Item onClick={() => md(MR.setControlTypeExtraction)}>{'Control Type Extraction'}</ContextMenu.Item>}
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </g>
      </ContextMenu.Root>
    </Fragment>
  )
}
