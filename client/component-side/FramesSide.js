import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import {COLORS} from "../core/Utils";
import {MAP_RIGHTS} from "../core/EditorFlow";
import Typography from "@material-ui/core/Typography";

export function FramesSide () {
    const frameEditorVisible = useSelector(state => state.frameEditorVisible)
    const frameLen = useSelector(state => state.frameLen)
    const frameSelected = useSelector(state => state.frameSelected)
    const mapRight = useSelector(state => state.mapRight)
    const dispatch = useDispatch()

    const {UNAUTHORIZED, VIEW, EDIT} = MAP_RIGHTS

    const importFrame =         _ => dispatch({type: 'IMPORT_FRAME'})
    const duplicateFrame =      _ => dispatch({type: 'DUPLICATE_FRAME'})
    const deleteFrame =         _ => dispatch({type: 'DELETE_FRAME'})
    const prevFrame =           _ => dispatch({type: 'PREV_FRAME'})
    const nextFrame =           _ => dispatch({type: 'NEXT_FRAME'})
    const closePlaybackEditor = _ => dispatch({type: 'CLOSE_PLAYBACK_EDITOR'})

    return (
        <div style={{
            position: 'fixed',
            right: 0,
            top: 400,
            width: 216,
            backgroundColor: COLORS.MAP_BACKGROUND,
            paddingTop: 6,
            paddingBottom: 6,
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderRight: 0
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12
            }}>
                <StyledButtonGroup
                    open={frameEditorVisible === 1}
                    valueList={['import', 'duplicate', 'delete']}
                    value={''}
                    action={e => {
                        e === 'import' && importFrame();
                        e === 'duplicate' && duplicateFrame();
                        e === 'delete' && deleteFrame();
                    }}
                    valueListDisabled={[false, ...Array(2).fill(!frameLen)]}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={frameEditorVisible === 1}
                    valueList={['prev', 'next']}
                    action={e => {
                        e === 'prev' && prevFrame();
                        e === 'next' && nextFrame();
                    }}
                    valueListDisabled={[frameSelected === 0, frameSelected === frameLen - 1]}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
                <StyledButtonGroup
                    open={frameEditorVisible === 1}
                    valueList={['close']}
                    value={''}
                    action={closePlaybackEditor}
                    disabled={[UNAUTHORIZED, VIEW].includes(mapRight)}
                />
            </div>
        </div>
    );
}
