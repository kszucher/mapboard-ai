import React, {useContext} from 'react';
import {Context} from '../core/Store';
import {StyledIconButton} from "../component-styled/StyledIconButton";
import {Divider} from "@material-ui/core";

export function ToolBar () {
    const [state, dispatch] = useContext(Context);

    const undo =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'undo'});
    const redo =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'redo'});
    const save =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'save'});
    const cut =               _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'cut'});
    const copy =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'copy'});
    const paste =             _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'paste'});
    const task =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'task'});
    const formatColorReset =  _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'formatColorReset'});

    return (
        <div style={{
            position: 'fixed',
            left: '100%',
            transform: 'translate(-100%)',
            display: 'flex',
            alignItems: 'center',
            height: '48px',
            paddingLeft: '10px',
            paddingRight: '10px',
            backgroundColor: '#fbfafc',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
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
                <StyledIconButton input = {[undo, 'undo', 0]}/>
                <StyledIconButton input = {[redo, 'redo', 0]}/>
                <StyledIconButton input = {[save, 'save', 0]}/>

                {/*<Divider orientation="vertical" flexItem />*/}

                <StyledIconButton input = {[cut, 'content_cut', 0]}/>
                <StyledIconButton input = {[copy, 'content_copy', 0]}/>
                <StyledIconButton input = {[paste, 'content_paste', 0]}/>

                {/*<Divider orientation="vertical" flexItem />*/}

                <StyledIconButton input = {[task, 'check_circle', 0]}/>
                <StyledIconButton input = {[formatColorReset, 'format_color_reset', 0]}/>
            </div>
        </div>
    );
}
