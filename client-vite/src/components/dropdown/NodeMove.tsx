import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXASD, getCountXASU, getCountXSO1, getXAEO, isXASVN, isXRS, isXS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import ArrowsMove from "../../assets/arrows-move.svg?react"

export const NodeMove = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="violet">
          <ArrowsMove/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.moveSU)}>{'Node Up'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && getCountXASD(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.moveSD)}>{'Node Down'}</DropdownMenu.Item>}
        {isXS(m) && isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.moveSO)}>{'Node Out'}</DropdownMenu.Item>}
        {!isXRS(m) && isXASVN(m) && <DropdownMenu.Item onClick={() => md(MR.moveSI)}>{'Node In'}</DropdownMenu.Item>}
        {isXS(m) && getCountXSO1(m) > 0 && !getXAEO(m).some(ti => ti.path.includes('c')) && <DropdownMenu.Item onClick={() => md(MR.moveS2TO)}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
