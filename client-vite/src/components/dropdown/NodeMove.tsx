import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {MR} from "../../reducers/MapReducerEnum.ts"
import {getCountXASD, getCountXASU, getCountXSO1, getMapMode, getXAEO, isXASVN, isXRS, isXS} from "../../queries/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import ArrowsMove from "../../assets/arrows-move.svg?react"
import {MapMode} from "../../state/Enums.ts"

export const NodeMove = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const mapMode = getMapMode(m)
  const dispatch = useDispatch<AppDispatch>()
  const md = (type: MR, payload? : any) => dispatch(actions.mapAction({type, payload}))
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={mapMode === MapMode.VIEW}>
        <IconButton variant="solid" color="gray">
          <ArrowsMove/>
        </IconButton>
      </DropdownMenu.Trigger>
      {mapMode === MapMode.EDIT_STRUCT && isXS(m) &&
        <DropdownMenu.Content>
          {isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.moveSU)}>{'Node Up'}</DropdownMenu.Item>}
          {isXASVN(m) && getCountXASD(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.moveSD)}>{'Node Down'}</DropdownMenu.Item>}
          {isXASVN(m) && getCountXASU(m) > 0 && <DropdownMenu.Item onClick={() => md(MR.moveSO)}>{'Node Out'}</DropdownMenu.Item>}
          {!isXRS(m) && isXASVN(m) && <DropdownMenu.Item onClick={() => md(MR.moveSI)}>{'Node In'}</DropdownMenu.Item>}
          {getCountXSO1(m) > 0 && !getXAEO(m).some(ti => ti.path.includes('c')) && <DropdownMenu.Item onClick={() => md(MR.moveS2TO)}>{'Sub Nodes To Table'}</DropdownMenu.Item>}
        </DropdownMenu.Content>
      }
    </DropdownMenu.Root>
  )
}
