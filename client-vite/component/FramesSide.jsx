import {useSelector, useDispatch} from "react-redux";
import { getColors } from '../core/Colors'
import { Button } from '@mui/material'

export function FramesSide () {
    const colorMode = useSelector(state => state.colorMode)
    const { PAGE_BACKGROUND, MAP_BACKGROUND } = getColors(colorMode)
    const dispatch = useDispatch()
    const importFrame = _ => dispatch({type: 'IMPORT_FRAME'})
    const duplicateFrame = _ => dispatch({type: 'DUPLICATE_FRAME'})
    const deleteFrame = _ => dispatch({type: 'DELETE_FRAME'})
    const closeFrameEditor = _ => dispatch({type: 'CLOSE_FRAME_EDITOR'})
    return (
        <div style={{
            position: 'fixed',
            top: 96,
            right: 64,
            width: 6*32,
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap', gap: 12,
            borderRadius: 16,
            border: `1px solid ${PAGE_BACKGROUND}`,
            padding: 12,
            background: MAP_BACKGROUND,
        }}>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined' onClick={importFrame}>{'IMPORT'}</Button>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined' onClick={duplicateFrame}>{'DUPLICATE'}</Button>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined' onClick={deleteFrame}>{'DELETE'}</Button>
            </div>
            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center' }}>
                <Button color="primary" variant='outlined' onClick={closeFrameEditor}>{'CLOSE'}</Button>
            </div>
        </div>
    )
}
