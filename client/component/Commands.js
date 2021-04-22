import React, {useContext} from 'react';
import {Context} from '../core/Store';
import {StyledIconButton} from "../component-styled/StyledIconButton";
import {Divider} from "@material-ui/core";

export function Commands () {
    const [state, dispatch] = useContext(Context);

    const undo =             () => dispatch({type: 'SET_MAP_ACTION',  payload: 'undo'});
    const redo =             () => dispatch({type: 'SET_MAP_ACTION',  payload: 'redo'});
    const save =             () => dispatch({type: 'SET_MAP_ACTION',  payload: 'save'});
    const cut =              () => dispatch({type: 'SET_MAP_ACTION',  payload: 'cut'});
    const copy =             () => dispatch({type: 'SET_MAP_ACTION',  payload: 'copy'});
    const paste =            () => dispatch({type: 'SET_MAP_ACTION',  payload: 'paste'});
    const task =             () => dispatch({type: 'SET_MAP_ACTION',  payload: 'task'});
    const formatColorReset = () => dispatch({type: 'SET_MAP_ACTION',  payload: 'formatColorReset'});

    return (
        <div style={{
            position: 'fixed',
            left: '100%',
            transform: 'translate(-100%)',
            display: 'flex',
            alignItems: 'center',
            height: 48,
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: '#fbfafc',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderTop: 0,
            borderRight: 0,
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <StyledIconButton action={undo} icon={'undo'}/>
                <StyledIconButton action={redo} icon={'redo'}/>
                <StyledIconButton action={save} icon={'save'}/>

                {/*<Divider orientation="vertical" flexItem />*/}

                <StyledIconButton action={cut} icon={'content_cut'}/>
                <StyledIconButton action={copy} icon={'content_copy'}/>
                <StyledIconButton action={paste} icon={'content_paste'}/>

                {/*<Divider orientation="vertical" flexItem />*/}

                <StyledIconButton action={task} icon={'check_circle'}/>
                <StyledIconButton action={formatColorReset} icon={'format_color_reset'}/>
            </div>
        </div>
    );
}
