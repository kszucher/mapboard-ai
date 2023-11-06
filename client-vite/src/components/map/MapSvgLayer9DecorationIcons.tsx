import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mTR} from "../../selectors/MapSelector"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {adjustIcon} from "../../utils/Utils"
import {mSelector} from "../../state/EditorState"
import {ControlTypes} from "../../state/Enums"
import {T} from "../../state/MapStateTypes"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const MapSvgLayer9DecorationIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g>
      {mTR(m).map((t: T) => (
        <g key={t.nodeId}>
          {t.controlType === ControlTypes.INGESTION &&
            <g width="24" height="24" viewBox="0 0 24 24" transform={`translate(${adjustIcon(t.nodeStartX -36)}, ${adjustIcon(t.nodeY - 12)})`}{...{vectorEffect: 'non-scaling-stroke'}} style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}>
              <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
              <g xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z"></path>
                <path d="M14 3v4a1 1 0 001 1h4"></path>
                <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"></path>
              </g>
              <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                let input = document.createElement('input')
                input.type = 'file'
                input.onchange = (e) => {
                  let files = Array.from(input.files!)
                  const formData = new FormData()
                  formData.append('username', 'Sandra Rodgers')
                  formData.append('files', files[0])
                  fetch('http://localhost:8080/upload_files', {method: 'post', body: formData})
                    .then((res) => console.log(res))
                    .catch((err) => {})
                }
                input.click()
              }}/>
            </g>}
          {t.controlType === ControlTypes.EXTRACTION &&
            <g width="24" height="24" viewBox="0 0 24 24" transform={`translate(${adjustIcon(t.nodeStartX -36)}, ${adjustIcon(t.nodeY - 12)})`}{...{vectorEffect: 'non-scaling-stroke'}} style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}>
              <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
              <g xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 18a2 2 0 012 2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 01-2 2zm0-12a2 2 0 012 2 2 2 0 012-2 2 2 0 01-2-2 2 2 0 01-2 2zM9 18a6 6 0 016-6 6 6 0 01-6-6 6 6 0 01-6 6 6 6 0 016 6z"></path>
              </g>
              <rect width="24" height="24" style={{opacity: 0}} onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}/>
            </g>}
        </g>
      ))}
    </g>
  )
}
