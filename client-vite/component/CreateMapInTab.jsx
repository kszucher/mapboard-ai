import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export function CreateMapInTab () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND, PAGE_BACKGROUND} = getColors(colorMode)
    const tabMapNameList = useSelector(state => state.tabMapNameList)
    const dispatch = useDispatch()
    return (
        <div style={{
            position: 'fixed',
            left: 0,
            top: 48*2 + 48*tabMapNameList.length + 48,
            width: 40,
            height: 40,
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
                <IconButton color='secondary' onClick={_=>{}}>
                    <AddCircleOutlineIcon/>
                </IconButton>
            </div>
        </div>
    )
}
