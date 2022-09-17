import { IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useDispatch } from 'react-redux'

export default function Logo() {
    const dispatch = useDispatch()
    const toggleTabShrink = () => dispatch({type: 'TOGGLE_TAB_SHRINK'})
    return (
        <div className="fixed w-[224px] h-[40px] py-1 rounded-br-2xl flex items-center justify-center bg-gradient-to-r from-mb-purple to-mb-pink text-white">
            <Toolbar variant={"dense"}>
                <IconButton
                    sx={{ mr: 2 }}
                    edge="start"
                    aria-label="menu"
                    onClick={toggleTabShrink}
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
