import {Dialog} from "@radix-ui/themes"
import {FC, ReactNode} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../selectors/MapQueries.ts"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {ControlType, DialogState} from "../../state/Enums"
import {T} from "../../state/MapStateTypes"
import ArrowUp from "../../assets/arrow-up.svg?react"
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

export const MapSvgDecorationIcons: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {mTR(m).map((t: T) => (
        <g key={t.nodeId}>
          {t.controlType === ControlType.INGESTION &&
            <g>
              <DecorationIcon x={t.nodeStartX + 12} y={t.nodeStartY + t.selfH / 2 -12} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_INGESTION))}>
                <ArrowUp/>
              </DecorationIcon>
            </g>
          }
          {t.controlType === ControlType.EXTRACTION &&
            <g>
              <DecorationIcon x={t.nodeStartX + 12} y={t.nodeStartY + t.selfH / 2 - 12} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_EXTRACTION))}>
                <PlayerPlayFilled/>
              </DecorationIcon>
            </g>
          }
        </g>
      ))}
    </g>
  )
}
