import React, {useContext} from 'react';
import {Context} from '../core/Store';
import {StyledIconButton} from "../component-styled/StyledIconButton";
import '../component-css/ToolBar.css'
import {Divider} from "@material-ui/core";

export function ToolBar () {
    const [state, dispatch] = useContext(Context);

    const undo =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'undo'});
    const redo =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'redo'});
    const save =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'save'});

    const mouseSelect =       _ => dispatch({type: 'SET_MOUSE_MODE',  payload: 'select'});
    const mouseDrag =         _ => dispatch({type: 'SET_MOUSE_MODE',  payload: 'drag'});

    const cut =               _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'cut'});
    const copy =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'copy'});
    const paste =             _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'paste'});
    const task =              _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'task'});
    const formatColorReset =  _ => dispatch({type: 'SET_MAP_ACTION',  payload: 'formatColorReset'});

    return (
        // <div id = 'toolbar-container'>
            <div id = 'toolbar'>
                <div className={'buttons'}>
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
        // </div>
    );
}
