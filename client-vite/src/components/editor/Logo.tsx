import {FC} from "react"
import { IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useDispatch } from 'react-redux'
import {actions, AppDispatch} from "../../reducers/EditorReducer"

export const Logo: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="fixed top-0 w-[224px] h-[40px] py-1 rounded-br-lg flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50">
      <Toolbar variant={"dense"}>
        <IconButton
          sx={{ mr: 2 }}
          edge="start"
          aria-label="menu"
          onClick={_=>dispatch(actions.toggleTabShrink())}
          color="inherit">
          <MenuIcon/>
        </IconButton>
        <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>

      </Toolbar>
    </div>
  )
}
