import React from 'react';
import {useDispatch} from 'react-redux';
import StyledButton from "../component-styled/StyledButton";
import {COLORS} from "../core/Utils";

export function Profile () {
    const dispatch = useDispatch()

    const openProfileEditor = () => dispatch({type: 'OPEN_PROFILE_EDITOR'})

    return (
        <div style={{
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
            borderRight: 0 }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <StyledButton version={'icon'} action={openProfileEditor} icon={'person'}/>
            </div>
        </div>
    );
}
