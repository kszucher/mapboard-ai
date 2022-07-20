import {useSelector, useDispatch} from "react-redux";
import { Button, IconButton, Modal, Typography } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

export function Settings() {
    const colorMode = useSelector(state => state.colorMode)
    const name = useSelector(state => state.name)
    const dispatch = useDispatch()
    const changeColorMode = _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const closeSettings = _ => dispatch({type: 'SHOW_WS'})
    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">

            <div id="settings">
                <Typography component="h1" variant="h5" color="primary">
                    {name}
                </Typography>
                <IconButton color='secondary' onClick={changeColorMode}>
                    {colorMode === 'light' && <LightModeIcon/>}
                    {colorMode === 'dark' && <DarkModeIcon/>}
                </IconButton>
                <Button color="primary" variant="outlined" onClick={closeSettings}>
                    {'CLOSE'}
                </Button>
            </div>

        </Modal>
    )
}
