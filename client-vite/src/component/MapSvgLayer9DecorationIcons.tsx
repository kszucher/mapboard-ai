import React, {FC} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useOpenWorkspaceQuery} from "../core/Api"
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {getNodeByPath, getR0, getXRi} from "../core/MapUtils"
import {adjustIcon} from "../core/Utils";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"
import {mSelector} from "../state/EditorState"
import {PageState} from "../state/Enums"
import {N} from "../state/MapStateTypes"

export const MapSvgLayer9DecorationIcons: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const r0 = getR0(m)
  const ri = getXRi(m)
  const rx = getNodeByPath(m, ['r', ri]) as N
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <g key={rx.nodeId}
       width="24" height="24" viewBox="0 0 24 24"
       transform={`translate(${adjustIcon(r0.nodeStartX + r0.selfW / 2 -12)}, ${adjustIcon(r0.nodeY - r0.selfH /2 - 12  - 12)})`}
       {...{vectorEffect: 'non-scaling-stroke'}}
       style={{transition: 'all 0.3s', transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)', transitionProperty: 'all'}}
    >
      <rect width="24" height="24" rx={4} ry={4} fill={'#666666'}/>
      {
        <g xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          {r0.note === '' &&
            <g>
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path d="M14 3v4a1 1 0 001 1h4"></path>
              <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2zM12 11v6"></path>
              <path d="M9.5 13.5L12 11l2.5 2.5"></path>
            </g>
          }
          {r0.note !== '' &&
            <g>
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path d="M14 3v4a1 1 0 001 1h4"></path>
              <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2zM9 9h1M9 13h6M9 17h6"></path>
            </g>
          }
        </g>
      }
      <rect
        width="24"
        height="24"
        style={{opacity: 0}}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          // dispatch(actions.setPageState(PageState.WS_EDIT_NOTE))

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
        }}
      />
    </g>
  )
}
