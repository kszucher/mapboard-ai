import {FC} from "react";
import { IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useDispatch } from 'react-redux'
import {actions} from "../core/EditorFlow"

export const Logo: FC = () => {
  const dispatch = useDispatch()
  return (
    <div className="fixed w-[224px] h-[40px] py-1 rounded-br-2xl flex items-center justify-center bg-gradient-to-r from-mb-purple to-mb-pink text-white">
      <Toolbar variant={"dense"}>
        <IconButton
          sx={{ mr: 2 }}
          edge="start"
          aria-label="menu"
          onClick={_=>dispatch(actions.toggleTabShrink())}
          color="inherit">
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6">
          {'mapboard'}
        </Typography>
      </Toolbar>
    </div>
  )
}
