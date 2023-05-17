import {FC} from "react"
import {useDispatch} from "react-redux"
import { Button, IconButton, Modal } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import {actions, AppDispatch} from "../editor/EditorReducer"
import {PageState} from "../core/Enums";
import {api, useOpenWorkspaceQuery} from "../core/Api";
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState";

export const Settings: FC = () => {
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal
      open={true}
      onClose={_=>{}}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description">
      <div className="_bg fixed left-1/2 -translate-x-1/2 top-[96px] width-[1000px] flex flex-col items-center gap-4 p-5 rounded-md">
        <IconButton
          color='secondary'
          onClick={() => dispatch(api.endpoints.toggleColorMode.initiate())}
        >
          {colorMode === 'light' && <LightModeIcon/>}
          {colorMode === 'dark' && <DarkModeIcon/>}
        </IconButton>
        <Button
          color="primary"
          variant="outlined"
          onClick={_=>dispatch(actions.setPageState(PageState.WS))}
        >
          {'CLOSE'}
        </Button>
      </div>
    </Modal>
  )
}
