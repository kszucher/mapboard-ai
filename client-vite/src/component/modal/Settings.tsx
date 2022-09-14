import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, IconButton, Modal } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

export function Settings() {
    const colorMode = useSelector((state: RootStateOrAny) => state.colorMode)
    const dispatch = useDispatch()
    const changeColorMode = () => dispatch({type: 'CHANGE_COLOR_MODE'})
    const closeSettings = () => dispatch({type: 'SHOW_WS'})
    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">

            <div id="settings" className="_bg">
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
