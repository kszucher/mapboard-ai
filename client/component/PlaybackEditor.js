import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";
import {List, ListItem, ListItemText, MobileStepper, Slider, useTheme} from "@material-ui/core";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import Button from "@material-ui/core/Button";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";

export function PlaybackEditor () {
    const theme = useTheme();

    const [state, dispatch] = useContext(Context)
    const {serverResponse, serverResponseCntr} = state
    const [frameLen, setFrameLen] = useState(0)
    const [frameSelection, setFrameSelection] = useState([])
    const prevFrame = _ => {
        let frameSelectedOut = frameSelection[0];
        let frameSelected = frameSelectedOut > 0 ? frameSelectedOut - 1 : 0;
        dispatch({type: 'OPEN_FRAME', payload: {frameSelected}})
    }
    const nextFrame = _ => {
        let frameSelectedOut = frameSelection[0];
        let frameSelected = frameSelectedOut === frameSelectedOut.length ? frameSelectedOut : frameSelectedOut + 1;
        dispatch({type: 'OPEN_FRAME', payload: {frameSelected}})
    }
    const importFrame = _ => {
        dispatch({type: 'IMPORT_FRAME'})
    }
    const openFrame = (idx) => {
        let frameSelected = idx;
        dispatch({type: 'OPEN_FRAME', payload: {frameSelected}})
    }
    const deleteFrame = _=> {
        if (frameLen > 0) {
            let frameSelectedOut = frameSelection[0];
            let frameSelected = frameSelectedOut > 0 ? frameSelectedOut - 1 : 0;
            dispatch({type: 'DELETE_FRAME', payload: {frameSelectedOut, frameSelected}})
        }
    }
    const duplicateFrame = _=> {
        let frameSelectedOut = frameSelection[0];
        let frameSelected = frameSelectedOut + 1;
        dispatch({type: 'DUPLICATE_FRAME', payload: {frameSelectedOut, frameSelected}})
    }
    const closePlaybackEditor = _ => {
        dispatch({type: 'CLOSE_PLAYBACK_EDITOR'})
    }

    useEffect(() => {
        if (serverResponse.payload?.hasOwnProperty('frameLen')) {
            setFrameLen(serverResponse.payload.frameLen);
        }
        if (serverResponse.payload?.hasOwnProperty('frameSelected')) {
            setFrameSelection([serverResponse.payload.frameSelected]);
        }
    }, [serverResponseCntr])

    const xWidth = 192;

    return (
        <div style={{
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%)',
            bottom: 0,
            width: 1366 - 2*20,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            padding: 20,

            backgroundColor: '#fbfafc',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#9040b8',
            borderBottom: 0
        }}>
            {frameLen > 0 &&
            // < Slider
            //     defaultValue={1}
            //     aria-labelledby="discrete-slider"
            //     valueLabelDisplay="on"
            //     step={1}
            //     marks
            //     min={1}
            //     max={frameLen}
            //     onChangeCommitted={(event, value) => openFrame(value - 1)}
            // />


            <MobileStepper
                variant="dots"
                steps={frameLen}
                position="static"
                activeStep={frameSelection[0]}
                // className={classes.root}
                nextButton={
                    <Button size="small" onClick={nextFrame} disabled={frameSelection[0] === frameLen - 1}>
                        Next Frame
                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={prevFrame} disabled={frameSelection[0] === 0}>
                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        Previous Frame
                    </Button>
                }
            />


            }




            <StyledButtonGroup action={importFrame} value={''} valueList={['import frame']}/>
            <StyledButtonGroup disabled={!frameSelection.length || !frameLen} action={deleteFrame} value={''} valueList={['delete frame']}/>
            <StyledButtonGroup disabled={!frameSelection.length || !frameLen} action={duplicateFrame} value={''} valueList={['duplicate frame']}/>
            <StyledButton name={'Close'} action={closePlaybackEditor}/>
        </div>
    );
}
