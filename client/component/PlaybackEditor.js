import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";
import {List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {Edit} from "@material-ui/icons";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export function PlaybackEditor () {
    const [state, dispatch] = useContext(Context)
    const {serverResponse, serverResponseCntr} = state
    const [playbackCount, setPlaybackCount] = useState(0)
    const [frameSelection, setFrameSelection] = useState([])

    const closePlaybackEditor = _ => dispatch({type: 'CLOSE_PLAYBACK_EDITOR'})
    const saveMapToPlayback =   () => {dispatch({type: 'SAVE_MAP_TO_PLAYBACK'})}
    const openMapFromPlayback = (idx) => {
        setFrameSelection([idx])
        dispatch({type: 'OPEN_MAP_FROM_PLAYBACK', payload: {playbackMapSelected: idx}})
    }

    useEffect(() => {
        if (serverResponse.cmd === 'getPlaybackCountSuccess') {
            setPlaybackCount(serverResponse.payload);
        }
    }, [serverResponseCntr]);

    const xWidth = 192;
    // const yWidth = 300;

    return (
        <div style={{
            position: 'fixed', top: 216+96+48, right: 0, width: xWidth, backgroundColor: 'rgba(251,250,252,1)',
            paddingTop: 12, paddingLeft: 12, paddingRight: 12, paddingBottom: 12,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderWidth: '1px', borderStyle: 'solid', borderColor: '#dddddd', borderRight: 0 }}>



            <StyledButtonGroup size="small" action={saveMapToPlayback} value={''} valueList={['save map to playback']}/>



            <List dense={true}>
                {[...Array(playbackCount).keys()].map((el, idx) => (
                    <ListItem
                        button
                        key={idx}
                        onClick={_=>openMapFromPlayback(idx)}
                        selected={frameSelection.includes(idx)} >
                        <ListItemText primary={`frame ${idx}`} secondary={1 === 0 ? 'Secondary text' : null}/>
                        {/*<ListItemSecondaryAction>*/}
                        {/*    <IconButton edge="end" aria-label="delete">*/}
                        {/*        <EditIcon />*/}
                        {/*    </IconButton>*/}
                        {/*    <IconButton edge="end" aria-label="delete">*/}
                        {/*        <DeleteIcon />*/}
                        {/*    </IconButton>*/}
                        {/*</ListItemSecondaryAction>*/}
                    </ListItem>
                ))}
            </List>
            <div style={{display: "flex", flexDirection: 'row', justifyContent: 'center', paddingTop: 12 }}>
                <StyledButton name={'Close'} action={closePlaybackEditor}/>
            </div>
        </div>
    );
}
