import {Dialog} from "@radix-ui/themes"
import {FC, ReactNode} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../selectors/MapQueries.ts"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {ControlType, DialogState} from "../../state/Enums"
import {T} from "../../state/MapStateTypes"
import {SettingsIcon, UploadIcon} from "../assets/Icons.tsx"
import PlayerPlayFilled from "../../assets/player-play-filled.svg?react"

const DecorationIcon = ({x, y, children, onClick} : {x: number, y: number, children: ReactNode, onClick: Function}) => (
  <g
    width="24"
    height="24"
    viewBox="0 0 24 24"
    transform={`translate(${adjustIcon(x)}, ${adjustIcon(y)})`}
    {...{vectorEffect: 'non-scaling-stroke'}}
    style={{
      transition: 'all 0.3s',
      transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
      transitionProperty: 'all'
    }}
  >
    <Dialog.Trigger>
      <circle cx={12} cy={12} r={12} className={"fill-gray-500 hover:fill-teal-700"} onClick={() => onClick()}/>
    </Dialog.Trigger>
    <g className={"pointer-events-none"}>
      {children}
    </g>
  </g>
)

export const MapSvgLayer9DecorationIcons: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {mTR(m).map((t: T) => (
        <g key={t.nodeId}>
          {t.controlType === ControlType.INGESTION &&
            <g>
              <DecorationIcon x={t.nodeStartX + t.selfW - 68} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_INGESTION))}>
                <UploadIcon/>
              </DecorationIcon>
              <DecorationIcon x={t.nodeStartX + t.selfW - 36} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_INGESTION))}>
                <SettingsIcon/>
              </DecorationIcon>
            </g>
          }
          {t.controlType === ControlType.EXTRACTION &&
            <g>
              <DecorationIcon x={t.nodeStartX + t.selfW - 68} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_EXTRACTION))}>
                <PlayerPlayFilled/>
              </DecorationIcon>
              <DecorationIcon x={t.nodeStartX + t.selfW - 36} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_EXTRACTION))}>
                <SettingsIcon/>
              </DecorationIcon>
            </g>
          }
        </g>
      ))}
    </g>
  )
}
