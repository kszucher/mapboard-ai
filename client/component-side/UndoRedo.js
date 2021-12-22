import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {mapDispatch, redraw} from "../core/MapFlow";
import {COLORS} from "../core/Utils";
import {MAP_RIGHTS} from "../core/EditorFlow";
import StyledIconButton from '../component-styled/StyledIconButton'

export function UndoRedo () {
    const mapRight = useSelector(state => state.mapRight)

    const dispatch = useDispatch()

    const undo = _ => {mapDispatch('undo'); redraw()}
    const redo = _ => {mapDispatch('redo'); redraw()}

    const {UNAUTHORIZED, VIEW} = MAP_RIGHTS

    return (
        <div style={{
            position: 'fixed',
            left: 216+48,
            width: 96,
            display: 'flex',
            alignItems: 'center',
            height: 48,
            paddingLeft: 12,
            paddingRight: 12,
            backgroundColor: COLORS.MAP_BACKGROUND,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderTop: 0,
            // borderRight: 0
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center' }}>
                <StyledIconButton onClick={undo} icon={'undo'} disabled={[VIEW, UNAUTHORIZED].includes(mapRight)} />
                <StyledIconButton onClick={redo} icon={'redo'} disabled={[VIEW, UNAUTHORIZED].includes(mapRight)} />
            </div>
        </div>
    );
}
