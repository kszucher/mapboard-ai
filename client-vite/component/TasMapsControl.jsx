import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import DeleteIcon from '@mui/icons-material/Delete'

export function TasMapsControl () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND, PAGE_BACKGROUND} = getColors(colorMode)
    const tabMapNameList = useSelector(state => state.tabMapNameList)
    const dispatch = useDispatch()
    const createMapInTab = _ => dispatch({type: 'CREATE_MAP_IN_TAB'})
    const moveUpMapInTab = _ => dispatch({type: 'MOVE_UP_MAP_IN_TAB'})
    const moveDownMapInTab = _ => dispatch({type: 'MOVE_DOWN_MAP_IN_TAB'})
    const removeMapInTab = _ => dispatch({type: 'REMOVE_MAP_IN_TAB'})
    return (
        <div style={{
            position: 'fixed',
            left: 0,
            top: 48*2 + 48*tabMapNameList.length + 48,
            width: 40,
            height: 40*4,
            padding: '4px 12px 4px 12px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: MAP_BACKGROUND,
            borderTop: `1px solid ${PAGE_BACKGROUND}`,
            borderRight: `1px solid ${PAGE_BACKGROUND}`,
            borderBottom: `1px solid ${PAGE_BACKGROUND}`,
            borderLeft: 0,
            borderRadius: '0 16px 16px 0',
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IconButton color='secondary' onClick={createMapInTab}>
                    <AddCircleOutlineIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={moveUpMapInTab}>
                    <MoveUpIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={moveDownMapInTab}>
                    <MoveDownIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={removeMapInTab}>
                    <DeleteIcon/>
                </IconButton>
            </div>
        </div>
    )
}
