import {RootStateOrAny, useDispatch, useSelector} from 'react-redux'
import { IconButton } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import DeleteIcon from '@mui/icons-material/Delete'

export function ControlsLeft () {
    const tabMapNameList = useSelector((state: RootStateOrAny) => state.tabMapNameList)
    const frameEditorVisible = useSelector((state: RootStateOrAny) => state.frameEditorVisible)
    const dispatch = useDispatch()
    const createMapInTab = () => dispatch({type: 'CREATE_MAP_IN_TAB'})
    const moveUpMapInTab = () => dispatch({type: 'MOVE_UP_MAP_IN_TAB'})
    const moveDownMapInTab = () => dispatch({type: 'MOVE_DOWN_MAP_IN_TAB'})
    const removeMapInTab = () => dispatch({type: 'REMOVE_MAP_IN_TAB'})
    return (
        <div id="controls-left" style={{top: 48*2 + 48*tabMapNameList.length + 48}}>
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
