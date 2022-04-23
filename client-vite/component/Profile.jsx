import { useDispatch, useSelector } from 'react-redux'
import { getColors } from '../core/Colors'
import { IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

export function Profile () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND, PAGE_BACKGROUND} = getColors(colorMode)
    const dispatch = useDispatch()
    const openProfile = _ => dispatch({type: 'OPEN_PROFILE'})
    return (
        <div style={{
            position: 'fixed',
            right: 0,
            width: 40,
            height: 40,
            padding: '4px 12px 4px 12px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: MAP_BACKGROUND,
            borderTop: 0,
            borderLeft: `1px solid ${PAGE_BACKGROUND}`,
            borderBottom: `1px solid ${PAGE_BACKGROUND}`,
            borderRight: 0,
            borderRadius: '0 0 0 16px',
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IconButton color='secondary' onClick={openProfile}>
                    <PersonIcon/>
                </IconButton>
            </div>
        </div>
    )
}
