import React, {useContext} from 'react';
import {Context} from '../core/Store';
import {StyledButton} from "../component-styled/StyledButton";
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
        <div id = 'toolbar-container'>
            <div id = 'toolbar'>
                <div className={'buttons'}>
                    <StyledButton input = {[undo, 'undo']}/>
                    <StyledButton input = {[redo, 'redo']}/>
                    <StyledButton input = {[save, 'save']}/>

                    <Divider orientation="vertical" flexItem />

                    <StyledButton input = {[mouseSelect, 'crop_free']}/>
                    <StyledButton input = {[mouseDrag, 'open_with']}/>

                    <Divider orientation="vertical" flexItem />

                    <StyledButton input = {[cut, 'content_cut']}/>
                    <StyledButton input = {[copy, 'content_copy']}/>
                    <StyledButton input = {[paste, 'content_paste']}/>

                    <Divider orientation="vertical" flexItem />

                    <StyledButton input = {[task, 'check_circle']}/>
                    <StyledButton input = {[formatColorReset, 'format_color_reset']}/>
                </div>
            </div>
        </div>
    );
}
