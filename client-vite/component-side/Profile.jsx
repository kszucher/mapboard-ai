import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import { getColors } from '../core/Colors'

export function Profile () {
    const colorMode = useSelector(state => state.colorMode)
    const dispatch = useDispatch()
    const openProfile = () => dispatch({type: 'OPEN_PROFILE'})
    return (
        <div
            style={{
                position: 'fixed',
                right: 0,
                width: 48,
                display: 'flex',
                alignItems: 'center',
                height: 48,
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: getColors(colorMode).MAP_BACKGROUND,
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                borderTop: 0,
                borderRight: 0,
                borderColor: getColors(colorMode).MAP_BACKGROUND,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton color='secondary' onClick={openProfile}>
                    <span className="material-icons">{'person'}</span>
                </IconButton>
            </div>
        </div>
    )
}
