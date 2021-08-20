import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";
import {MobileStepper} from "@material-ui/core";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import Button from "@material-ui/core/Button";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

export function PlaybackEditor () {
    const [state, dispatch] = useContext(Context)
    const {serverResponse, serverResponseCntr} = state
    const [frameLen, setFrameLen] = useState(0)
    const [frameSelection, setFrameSelection] = useState([])

    const prevFrame = _ =>           dispatch({type: 'OPEN_FRAME', payload: {frameSelected: frameSelection[0] - 1}})
    const nextFrame = _ =>           dispatch({type: 'OPEN_FRAME', payload: {frameSelected: frameSelection[0] + 1}})
    const importFrame = _ =>         dispatch({type: 'IMPORT_FRAME', payload: {frameSelected: frameSelection[0]}})
    const openFrame = idx => {       dispatch({type: 'OPEN_FRAME', payload: {frameSelected: idx}})}
    const deleteFrame = _=>          dispatch({type: 'DELETE_FRAME', payload: {frameSelectedOut: frameSelection[0], frameSelected: frameSelection[0] > 0 ? frameSelection[0] - 1 : 0}})
    const duplicateFrame = _=>       dispatch({type: 'DUPLICATE_FRAME', payload: {frameSelectedOut: frameSelection[0], frameSelected: frameSelection[0] + 1}})

    useEffect(() => {
        if (serverResponse.payload?.hasOwnProperty('frameLen') &&
            serverResponse.payload?.hasOwnProperty('frameSelected')) {
            setFrameLen(serverResponse.payload.frameLen);
            setFrameSelection([serverResponse.payload.frameSelected]);
        }
    }, [serverResponseCntr])

    return (
        <div style={{
            position: 'fixed', left: '50%', transform: 'translate(-50%)', bottom: 0, display: 'flex', alignItems: 'center',
            backgroundColor: '#fbfafc', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderWidth: '2px', borderStyle: 'solid', borderColor: '#9040b8', borderBottom: 0
        }}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <StyledButtonGroup action={importFrame} value={''} valueList={['import frame']}/>
                    <StyledButtonGroup disabled={!frameSelection.length || !frameLen} action={deleteFrame} value={''} valueList={['delete frame']}/>
                    <StyledButtonGroup disabled={!frameSelection.length || !frameLen} action={duplicateFrame} value={''} valueList={['duplicate frame']}/>
                </div>
                {frameLen > 0 &&
                <MobileStepper
                    style={{backgroundColor: '#fbfafc'}}
                    variant="dots"
                    steps={frameLen}
                    position="static"
                    activeStep={frameSelection[0]}
                    nextButton={
                        <Button style={{paddingLeft:20}} size="large" onClick={nextFrame} disabled={frameSelection[0] === frameLen - 1}>
                            {/*Next Frame*/}
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button style={{paddingRight:20}} size="large" onClick={prevFrame} disabled={frameSelection[0] === 0}>
                            <KeyboardArrowLeft />
                            {/*Previous Frame*/}
                        </Button>
                    }
                />}
            </div>
        </div>
    );
}
