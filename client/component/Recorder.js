import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";

export function Recorder () {
    const [state, dispatch] = useContext(Context);
    const {} = state;
    
    const recordCurrentState = () => {

    };

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 48*17,
            width: 216,
            backgroundColor: 'rgba(251,250,252,1)',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderRight: 0,
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12,
            }}>
                <StyledButton input = {['Record Current State', recordCurrentState]}/>
            </div>
        </div>
    );
}
