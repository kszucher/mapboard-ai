import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {nodeDispatch} from "../core/NodeFlow";
import {checkPop, mapDispatch, push, redraw} from "../core/MapFlow";
import {pasteDispatch} from "../core/PasteFlow";
import StyledButton from "../component-styled/StyledButton";
import {COLORS} from "../core/Utils";
import {MAP_RIGHTS} from "../core/EditorFlow";

export function UndoRedo () {
    const dispatch = useDispatch()

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
            backgroundColor: COLORS.MAP_BACKGROUND,
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
                <ControlledStyledButton version={'icon'} action={undo} icon={'undo'}/>
                <ControlledStyledButton version={'icon'} action={redo} icon={'redo'}/>
                <ControlledStyledButton version={'icon'} action={saveMap} icon={'save'}/>
            </div>
        </div>
    );
}

const ControlledStyledButton = (arg) => {
    const {version, action, icon} = arg;
    const mapRight = useSelector(state => state.mapRight)
    return (
        <StyledButton
            version={version}
            action={action}
            icon={icon}
            disabled={[MAP_RIGHTS.VIEW, MAP_RIGHTS.UNAUTHORIZED].includes(mapRight)}
        />
    )
}
