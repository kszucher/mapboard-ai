import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import { getColors } from '../core/Colors'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export function IconBar () {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const dispatch = useDispatch()
    const changeColorMode = _ => dispatch({type: 'CHANGE_COLOR_MODE'})
    const openProfile = _ => dispatch({type: 'OPEN_PROFILE'})
    return (
        <div
            style={{
                position: 'fixed',
                right: 0,
                width: 120,
                display: 'flex',
                alignItems: 'center',
                height: 48,
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: MAP_BACKGROUND,
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                borderTop: 0,
                borderRight: 0,
                borderColor: MAP_BACKGROUND,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <IconButton color='secondary' onClick={changeColorMode}>
                    {colorMode === 'light' && <LightModeIcon/>}
                    {colorMode === 'dark' && <DarkModeIcon/>}
                </IconButton>
                <IconButton color='secondary' onClick={openProfile}>
                    <span className="material-icons">{'person'}</span>
                </IconButton>
            </div>
        </div>
    )
}
