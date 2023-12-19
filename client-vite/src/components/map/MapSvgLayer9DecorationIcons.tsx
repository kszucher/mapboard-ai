import {Dialog} from "@radix-ui/themes"
import {FC, ReactNode} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../selectors/MapSelector"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {ControlTypes, DialogState} from "../../state/Enums"
import {T} from "../../state/MapStateTypes"
import {PlayIcon, SettingsIcon, UploadIcon} from "../assets/Icons.tsx"

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
          {t.controlType === ControlTypes.INGESTION &&
            <g>
              <DecorationIcon x={t.nodeEndX - 68} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_INGESTION))}>
                <UploadIcon/>
              </DecorationIcon>
              <DecorationIcon x={t.nodeEndX - 36} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_INGESTION))}>
                <SettingsIcon/>
              </DecorationIcon>
            </g>
          }
          {t.controlType === ControlTypes.EXTRACTION &&
            <g>
              <DecorationIcon x={t.nodeEndX - 68} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_EXTRACTION))}>
                <PlayIcon/>
              </DecorationIcon>
              <DecorationIcon x={t.nodeEndX - 36} y={t.nodeStartY + 8} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_EXTRACTION))}>
                <SettingsIcon/>
              </DecorationIcon>
            </g>
          }
        </g>
      ))}
    </g>
  )
}
