import { IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useDispatch } from 'react-redux'

export default function Logo() {
    const dispatch = useDispatch()
    const toggleTabShrink = () => dispatch({type: 'TOGGLE_TAB_SHRINK'})
    return (
        <div id="logo">
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
