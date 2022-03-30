import {useSelector, useDispatch} from 'react-redux'
import {MAP_RIGHTS} from "../core/EditorFlow"
import { IconButton } from '@mui/material'
import { getColors } from '../core/Colors'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

export function UndoRedo () {
    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const mapRight = useSelector(state => state.mapRight)
    const undoDisabled = useSelector(state => state.undoDisabled)
    const redoDisabled = useSelector(state => state.redoDisabled)
    const dispatch = useDispatch()
    const undo = _ => dispatch({ type: 'UNDO'})
    const redo = _ => dispatch({ type: 'REDO'})
    return (
        <div style={{
            position: 'fixed',
            left: 216+48,
            width: 96,
            display: 'flex',
            alignItems: 'center',
            height: 48,
            paddingLeft: 12,
            // paddingRight: 12,
            backgroundColor: MAP_BACKGROUND,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderTop: 0,
            borderColor: MAP_BACKGROUND,
        }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
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
