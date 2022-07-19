import {useSelector, useDispatch} from "react-redux";
import { Button, IconButton, Modal, Typography } from '@mui/material'
import { getColors } from '../core/Colors'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

export function Settings() {
    const colorMode = useSelector(state => state.colorMode)
    const name = useSelector(state => state.name)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const dispatch = useDispatch()
    const changeColorMode = _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const closeSettings = _ => dispatch({type: 'SHOW_WS'})
    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            {
                <div
                    style={{
                        position: 'fixed',
                        left: '50%',
                        transform: 'translate(-50%)',
                        top: 96,
                        width: 200+250+140+140+200,
                        flexDirection: 'column',
                        alignItems: 'center',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 16,
                        backgroundColor: MAP_BACKGROUND,
                        padding: 20,
                        borderColor: MAP_BACKGROUND,
                        borderRadius: 16
                    }}
                >

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
                </div>}
        </Modal>
    )
}
