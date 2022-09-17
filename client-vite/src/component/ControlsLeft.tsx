import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import { IconButton } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import DeleteIcon from '@mui/icons-material/Delete'

export function ControlsLeft () {
    const frameEditorVisible = useSelector((state: RootStateOrAny) => state.frameEditorVisible)
    const dispatch = useDispatch()
    const createMapInTab = () => dispatch({type: 'CREATE_MAP_IN_TAB'})
    const moveUpMapInTab = () => dispatch({type: 'MOVE_UP_MAP_IN_TAB'})
    const moveDownMapInTab = () => dispatch({type: 'MOVE_DOWN_MAP_IN_TAB'})
    const removeMapInTab = () => dispatch({type: 'REMOVE_MAP_IN_TAB'})
    return (
        <div className="_bg fixed left-0 width-[40px] py-1 px-3 flex items-center border-l-0 bottom-[48px] rounded-r-2xl">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IconButton color='secondary' onClick={createMapInTab} disabled={frameEditorVisible}>
                    <AddCircleOutlineIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={moveUpMapInTab} disabled={frameEditorVisible}>
                    <MoveUpIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={moveDownMapInTab} disabled={frameEditorVisible}>
                    <MoveDownIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={removeMapInTab} disabled={frameEditorVisible}>
                    <DeleteIcon/>
                </IconButton>
            </div>
        </div>
    )
}
