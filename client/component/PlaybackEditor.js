import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";
import {List, ListItem, ListItemText, Slider} from "@material-ui/core";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export function PlaybackEditor () {
    const [state, dispatch] = useContext(Context)
    const {serverResponse, serverResponseCntr} = state
    const [frameLen, setFrameLen] = useState(0)
    const [frameSelection, setFrameSelection] = useState([])

    const importFrame = _ => dispatch({type: 'IMPORT_FRAME'})
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
    const closePlaybackEditor = _ => dispatch({type: 'CLOSE_PLAYBACK_EDITOR'})

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
            position: 'fixed', top: 216+96+48, right: 0, width: xWidth, backgroundColor: 'rgba(251,250,252,1)',
            paddingTop: 12, paddingLeft: 12, paddingRight: 12, paddingBottom: 12,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderWidth: '1px', borderStyle: 'solid', borderColor: '#dddddd', borderRight: 0 }}>

            <StyledButtonGroup size="small" action={importFrame} value={''} valueList={['import frame']}/>

            {/*<List dense={true}>*/}
            {/*    {[...Array(frameLen).keys()].map((el, idx) => (*/}
            {/*        <ListItem*/}
            {/*            button*/}
            {/*            key={idx}*/}
            {/*            onClick={_=>openFrame(idx)}*/}
            {/*            selected={frameSelection.includes(idx)} >*/}
            {/*            <ListItemText primary={`frame ${idx}`} secondary={1 === 0 ? 'Secondary text' : null}/>*/}
            {/*        </ListItem>*/}
            {/*    ))}*/}
            {/*</List>*/}

            {frameLen > 0 &&
            < Slider
                defaultValue={1}
                // getAriaValueText={'cica'}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={frameLen}
                onChangeCommitted={(event, value) => openFrame(value - 1)}
            />}



            {frameSelection.length > 0 && frameLen > 0 &&
            <StyledButtonGroup size="small" action={deleteFrame} value={''} valueList={['delete frame']}/>}
            {frameSelection.length > 0 && frameLen > 0 &&
            <StyledButtonGroup size="small" action={duplicateFrame} value={''} valueList={['duplicate frame']}/>}

            <div style={{display: "flex", flexDirection: 'row', justifyContent: 'center', paddingTop: 12 }}>
                <StyledButton name={'Close'} action={closePlaybackEditor}/>
            </div>
        </div>
    );
}
