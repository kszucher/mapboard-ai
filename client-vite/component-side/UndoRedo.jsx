import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import { MAP_RIGHTS } from '../core/EditorFlow'

export function UndoRedo () {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const mapRight = useSelector(state => state.mapRight)
    const undoDisabled = useSelector(state => state.undoDisabled)
    const redoDisabled = useSelector(state => state.redoDisabled)
    const dispatch = useDispatch()
    const undo = _ => dispatch({ type: 'UNDO'})
    const redo = _ => dispatch({ type: 'REDO'})
    return (
        <div id="undo-redo">
            <div style={{ display: 'flex',  }}>
                <IconButton color='secondary' onClick={undo} disabled={[VIEW, UNAUTHORIZED].includes(mapRight) || undoDisabled}>
                    <UndoIcon/>
                </IconButton>
                <IconButton color='secondary' onClick={redo} disabled={[VIEW, UNAUTHORIZED].includes(mapRight) || redoDisabled}>
                    <RedoIcon/>
                </IconButton>
            </div>
        </div>
    )
}
