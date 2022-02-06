import React from 'react';
import {useDispatch} from 'react-redux';
import {COLORS} from "../core/Utils";
import IconButton from '@material-ui/core/IconButton'

export function Profile () {
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
                backgroundColor: COLORS.MAP_BACKGROUND,
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#dddddd',
                borderTop: 0,
                borderRight: 0
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
