import React, {useContext} from 'react';
import {Context} from '../core/Store';
import {nodeDispatch} from "../core/NodeFlow";
import {checkPop, mapDispatch, push, redraw} from "../core/MapFlow";
import {pasteDispatch} from "../core/PasteFlow";
import StyledButton from "../component-styled/StyledButton";
import {getBgc} from "../core/Utils";

export function CommandButtons () {
    const [state, dispatch] = useContext(Context);

    const undo =                () => {mapDispatch('undo'); redraw()}
    const redo =                () => {mapDispatch('redo'); redraw()}
    const saveMap =             () => {dispatch({type: 'SAVE_MAP'})}
    const cut =                 () => {push(); nodeDispatch('cutSelection'); redraw(); checkPop()}
    const copy =                () => {push(); nodeDispatch('copySelection'); redraw(); checkPop()}
    const paste =               () => {pasteDispatch()};

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
            backgroundColor: getBgc(),
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderTop: 0,
            borderRight: 0 }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center' }}>
                <StyledButton version={'icon'} action={undo} icon={'undo'}/>
                <StyledButton version={'icon'} action={redo} icon={'redo'}/>
                <StyledButton version={'icon'} action={saveMap} icon={'save'}/>
            </div>
        </div>
    );
}
