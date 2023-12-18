import {FC} from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {getSubProcessList} from "../../selectors/MapProcess"
import {mTR} from "../../selectors/MapSelector"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {ControlTypes} from "../../state/Enums"
import {T} from "../../state/MapStateTypes"
import {getMapId} from "../../state/NodeApiState"
import {ArrowsShuffle2Icon, FilterIcon} from "../assets/Icons.tsx"

export const MapSvgLayer9DecorationIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  return (
    <g>
      {mTR(m).map((t: T) => (
        <g key={t.nodeId}>
          {t.controlType === ControlTypes.INGESTION &&
            <g
              width="24"
              height="24"
              viewBox="0 0 24 24"
              transform={`translate(${adjustIcon(t.nodeStartX + 24)}, ${adjustIcon(t.nodeStartY + t.selfH / 2 - 12)})`}{...{vectorEffect: 'non-scaling-stroke'}}
              style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
            >
              <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
              <FilterIcon/>
              <rect
                width="24"
                height="24"
                style={{opacity: 0}}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  let input = document.createElement('input')
                  input.type = 'file'
                  input.onchange = () => {
                    let files = Array.from(input.files!)
                    const formData = new FormData()
                    formData.append('username', 'Sandra Rodgers')
                    formData.append('files', files[0])
                    fetch('http://localhost:8080/upload_files', {method: 'post', body: formData})
                      .then((res) => console.log(res))
                      .catch(() => {})
                  }
                  input.click()
                }}/>
            </g>}
          {t.controlType === ControlTypes.EXTRACTION &&
            <g
              width="24"
              height="24"
              viewBox="0 0 24 24"
              transform={`translate(${adjustIcon(t.nodeStartX + 24)}, ${adjustIcon(t.nodeStartY + t.selfH / 2 - 12)})`}{...{vectorEffect: 'non-scaling-stroke'}}
              style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
            >
              <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
              <ArrowsShuffle2Icon/>
              <rect
                width="24"
                height="24"
                style={{opacity: 0}}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log({processId: getMapId(), subProcesses: getSubProcessList(m, t.nodeId)})
                }}/>
            </g>}
        </g>
      ))}
    </g>
  )
}
