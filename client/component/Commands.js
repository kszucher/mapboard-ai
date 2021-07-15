import React, {useContext} from 'react';
import {Context} from '../core/Store';
import {StyledIconButton} from "../component-styled/StyledIconButton";
import {nodeDispatch} from "../core/NodeFlow";
import {checkPop, mapDispatch, push, redraw} from "../core/MapFlow";
import {pasteDispatch} from "../core/PasteFlow";

export function Commands () {
    const [state, dispatch] = useContext(Context);

    const undo =             () => {mapDispatch('undo'); redraw()}
    const redo =             () => {mapDispatch('redo'); redraw()}
    const saveMap =          () => {dispatch({type: 'SAVE_MAP'})}
    const saveMapPlayback =  () => {dispatch({type: 'SAVE_MAP_PLAYBACK'})}

    const cut =              () => {push(); nodeDispatch('cutSelection'); redraw(); checkPop()}
    const copy =             () => {push(); nodeDispatch('copySelection'); redraw(); checkPop()}
    const paste =            () => {pasteDispatch()};

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            width: 192,
            display: 'flex',
            alignItems: 'center',
            height: 48,
            paddingLeft: 12,
            paddingRight: 12,
            backgroundColor: '#fbfafc',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderTop: 0,
            borderRight: 0
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',

            }}>
                <StyledIconButton action={undo} icon={'undo'}/>
                <StyledIconButton action={redo} icon={'redo'}/>
                <StyledIconButton action={saveMap} icon={'save'}/>
                <StyledIconButton action={saveMapPlayback} icon={'save'}/>
            </div>
        </div>
    );
}
