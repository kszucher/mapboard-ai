import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, IconButton, Modal } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import {actions, PageState, sagaActions} from "../core/EditorFlow";

export function Settings() {
    const colorMode = useSelector((state: RootStateOrAny) => state.colorMode)
    const dispatch = useDispatch()
    return(
        <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div className="_bg fixed left-1/2 -translate-x-1/2 top-[96px] width-[1000px] flex flex-col items-center gap-4 p-5 rounded-2xl">
                <IconButton color='secondary' onClick={_=>dispatch(sagaActions.toggleColorMode())}>
                    {colorMode === 'light' && <LightModeIcon/>}
                    {colorMode === 'dark' && <DarkModeIcon/>}
                </IconButton>
                <Button color="primary" variant="outlined" onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
                    {'CLOSE'}
                </Button>
            </div>
        </Modal>
    )
}
