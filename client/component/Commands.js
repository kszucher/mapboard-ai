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
    const formatReset =      () => dispatch({type: 'SET_MAP_ACTION',  payload: 'formatReset'});

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
                <StyledIconButton action={save} icon={'save'}/>

                {/*<Divider orientation="vertical" flexItem />*/}

                {/*<StyledIconButton action={cut} icon={'content_cut'}/>*/}
                {/*<StyledIconButton action={copy} icon={'content_copy'}/>*/}
                {/*<StyledIconButton action={paste} icon={'content_paste'}/>*/}

                {/*<Divider orientation="vertical" flexItem />*/}

                {/*<StyledIconButton action={task} icon={'check_circle'}/>*/}
                <StyledIconButton action={formatReset} icon={'format_color_reset'}/>
            </div>
        </div>
    );
}
