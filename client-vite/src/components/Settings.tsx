import {FC} from "react"
import {useDispatch} from "react-redux"
import { Button, IconButton, Modal } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import {actions, AppDispatch} from "../reducers/EditorReducer"
import {PageState} from "../state/Enums"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"

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
      <div className="_bg fixed left-1/2 -translate-x-1/2 top-[80px] width-[1000px] flex flex-col items-center gap-4 p-5 rounded-lg">
        <IconButton
          color='secondary'
          onClick={() => dispatch(nodeApi.endpoints.toggleColorMode.initiate())}
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
