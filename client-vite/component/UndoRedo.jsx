import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import { MAP_RIGHTS } from '../core/EditorFlow'

export function UndoRedo () {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS

    const colorMode = useSelector(state => state.colorMode)
    const mapRight = useSelector(state => state.mapRight)
    const undoDisabled = useSelector(state => state.undoDisabled)
    const redoDisabled = useSelector(state => state.redoDisabled)

    const {MAP_BACKGROUND, PAGE_BACKGROUND} = getColors(colorMode)

    const dispatch = useDispatch()
    const undo = _ => dispatch({ type: 'UNDO'})
    const redo = _ => dispatch({ type: 'REDO'})

    return (
        <div style={{
            position: 'fixed',
            left: 216+48,
            width: 2*40,
            display: 'flex',
            alignItems: 'center',
            height: 40,
            padding: '4px 12px 4px 12px',
            backgroundColor: MAP_BACKGROUND,
            borderTop: 0,
            borderLeft: `1px solid ${PAGE_BACKGROUND}`,
            borderBottom: `1px solid ${PAGE_BACKGROUND}`,
            borderRight: `1px solid ${PAGE_BACKGROUND}`,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
        }}>
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
