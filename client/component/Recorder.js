import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";

export function Recorder () {
    const [state, dispatch] = useContext(Context);
    const {} = state;
    
    const recordCurrentSelection = () => {

    };
    const startRecordingActions = () => {};
    const stopRecordingActions = () => {};
    const addRenderStep = () => {};
    const printContent = () => {};
    const playStepByStep = () => {};

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
                <StyledButton input = {['Record Current Selection', recordCurrentSelection]}/>
                <StyledButton input = {['Start Recording Actions', startRecordingActions]}/>
                <StyledButton input = {['Stop Recording Actions', stopRecordingActions]}/>
                <StyledButton input = {['Add Render Step', addRenderStep]}/>
                <StyledButton input = {['Print Content', printContent]}/>
                <StyledButton input = {['Play Step-By-Step', playStepByStep]}/>
            </div>
        </div>
    );
}
