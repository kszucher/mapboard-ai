import {DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getG} from "../../selectors/MapSelector"
import {mSelector} from "../../state/EditorState"
import {EyeIcon} from "../assets/Icons"

export const EditorMapShares = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <EyeIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {/*{<DropdownMenu.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARES))}}>{'Shares'}</DropdownMenu.Item>}*/}
        {/*{<DropdownMenu.Item onClick={()=>{dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}}>{'Share This Map'}</DropdownMenu.Item>}*/}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

