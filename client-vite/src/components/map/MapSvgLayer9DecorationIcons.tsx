import {Dialog} from "@radix-ui/themes"
import {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../selectors/MapSelector"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {ControlTypes, DialogState} from "../../state/Enums"
import {T} from "../../state/MapStateTypes"
import {ExtractionIcon, IngestionIcon} from "../assets/Icons.tsx"

export const MapSvgLayer9DecorationIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {mTR(m).map((t: T) => (
        <g key={t.nodeId}>
          {t.controlType === ControlTypes.INGESTION &&
            <g
              width="24"
              height="24"
              viewBox="0 0 24 24"
              transform={`translate(${adjustIcon(t.nodeEndX - 36)}, ${adjustIcon(t.nodeStartY + 6)})`}{...{vectorEffect: 'non-scaling-stroke'}}
              style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
            >
              <rect width="24" height="24" rx={32} ry={32} fill={'#666666'}/>
              <IngestionIcon/>
              <Dialog.Trigger>
                <rect
                  width="24"
                  height="24"
                  style={{opacity: 0}}
                  onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_INGESTION))}
                />
              </Dialog.Trigger>
            </g>}
          {t.controlType === ControlTypes.EXTRACTION &&
            <g
              width="24"
              height="24"
              viewBox="0 0 24 24"
              transform={`translate(${adjustIcon(t.nodeEndX - 36)}, ${adjustIcon(t.nodeStartY + 6)})`}{...{vectorEffect: 'non-scaling-stroke'}}
              style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
            >
              <rect width="24" height="24" rx={32} ry={32} fill={'#666666'}/>
              <ExtractionIcon/>
              <Dialog.Trigger>
                <rect
                  width="24"
                  height="24"
                  style={{opacity: 0}}
                  onClick={() => dispatch(actions.setDialogState(DialogState.ROOT_EXTRACTION))}
                />
              </Dialog.Trigger>
            </g>}
        </g>
      ))}
    </g>
  )
}
