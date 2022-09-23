import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import { IconButton } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import DeleteIcon from '@mui/icons-material/Delete'
import {sagaActions} from "../core/EditorFlow";

export function ControlsLeft () {
    const frameEditorVisible = useSelector((state: RootStateOrAny) => state.frameEditorVisible)
    const dispatch = useDispatch()
    return (
        <div className="_bg fixed left-0 width-[40px] py-1 px-3 flex items-center border-l-0 bottom-[48px] rounded-r-2xl">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IconButton
                    color='secondary'
                    onClick={_=>dispatch(sagaActions.createMapInTab())}
                    disabled={frameEditorVisible}
                >
                    <AddCircleOutlineIcon/>
                </IconButton>
                <IconButton
                    color='secondary'
                    onClick={_=>dispatch(sagaActions.moveUpMapInTab())}
                    disabled={frameEditorVisible}
                >
                    <MoveUpIcon/>
                </IconButton>
                <IconButton
                    color='secondary'
                    onClick={_=>dispatch(sagaActions.moveDownMapInTab())}
                    disabled={frameEditorVisible}
                >
                    <MoveDownIcon/>
                </IconButton>
                <IconButton
                    color='secondary'
                    onClick={_=>dispatch(sagaActions.removeMapInTab())}
                    disabled={frameEditorVisible}
                >
                    <DeleteIcon/>
                </IconButton>
            </div>
        </div>
    )
}
