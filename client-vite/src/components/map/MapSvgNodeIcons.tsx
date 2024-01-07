import {Dialog} from "@radix-ui/themes"
import {FC, Fragment, ReactNode} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {ControlType, DialogState} from "../../state/Enums"
import {T} from "../../state/MapStateTypes"
import CircleLetterI from "../../assets/circle-letter-i.svg?react"
import CircleLetterE from "../../assets/circle-letter-e.svg?react"

const DecorationIcon = ({x, y, children, onClick} : {x: number, y: number, children: ReactNode, onClick: Function}) => (
  <g
    transform={`translate(${Math.round(x)}, ${Math.round(y)})`}
    style={{
      transition: 'all 0.3s',
      transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
      transitionProperty: 'all'
    }}
  >
    <Dialog.Trigger>
      <rect width={24} height={24} rx={20} ry={20} className={"fill-gray-500 hover:fill-teal-700"} onClick={() => onClick()}/>
    </Dialog.Trigger>
    <g className={"pointer-events-none"}>
      {children}
    </g>
  </g>
)

export const MapSvgNodeIcons: FC = () => {
  const m = useSelector((state: RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    mTR(m).map((t: T) => (
      <Fragment key={t.nodeId}>
        {t.controlType === ControlType.INGESTION &&
          <DecorationIcon x={t.nodeStartX + 12} y={t.nodeStartY + t.selfH / 2 - 12} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_INGESTION))}>
            <CircleLetterI/>
          </DecorationIcon>
        }
        {t.controlType === ControlType.EXTRACTION &&
          <DecorationIcon x={t.nodeStartX + 12} y={t.nodeStartY + t.selfH / 2 - 12} onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_EXTRACTION))}>
            <CircleLetterE/>
          </DecorationIcon>
        }
      </Fragment>
    ))
  )
}
