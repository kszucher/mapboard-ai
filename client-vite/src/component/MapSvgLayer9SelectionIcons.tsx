import React, {FC, Fragment} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {getCountNSO1, getCountXSO1, getNodeByPath, getR0, getRi, getX, getXRi, getXSSCXX, isXR, isXS} from "../core/MapUtils"
import {adjustIcon} from "../core/Utils";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {PageState} from "../state/Enums"
import {N} from "../state/MapStateTypes"
import {MapSvgIcon} from "./MapSvgIcons";
import {MapSvgIconWrapper} from "./MapSvgIconWrapper"
import {calcSvgIconOffsetX} from "./MapSvgUtils"

export const MapSvgLayer9SelectionIcons: FC = () => {
  const nodeMenu = useSelector((state: RootState) => state.editor.nodeMenu)
  const m = useSelector((state:RootState) => mSelector(state))
  const xn = getX(m)
  const r0 = getR0(m)
  const ri = getXRi(m)
  const rx = getNodeByPath(m, ['r', ri]) as N
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {
        <Fragment key={rx.nodeId}>
          <MapSvgIconWrapper x={r0.nodeStartX + r0.selfW / 2 -12} y={r0.nodeY - r0.selfH /2 - 12  - 12} iconName={r0.note === '' ? 'FileUpload' : 'FileText'} onMouseDownGuarded={() => {
            dispatch(actions.setPageState(PageState.WS_EDIT_NOTE))
          }}/>
        </Fragment>
      }
    </g>
  )
}
