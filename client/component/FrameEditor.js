import React, {useContext, useEffect} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";

export function FrameEditor () {
    const [state, dispatch] = useContext(Context);

    const closeFrameEditor = _ => dispatch({type: 'CLOSE_FRAME_EDITOR'})

    useEffect(() => {

    }, []);

    const xWidth = 192;
    const yWidth = 300;

    return (
        <div style={{
            position: 'fixed', top: 216+96+48, right: 0, width: xWidth, height: yWidth, backgroundColor: 'rgba(251,250,252,1)',
            paddingTop: 12, paddingLeft: 12, paddingRight: 12, paddingBottom: 12,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderWidth: '1px', borderStyle: 'solid', borderColor: '#dddddd', borderRight: 0 }}>



            <div style={{display: "flex", flexDirection: 'row', justifyContent: 'center', paddingTop: 12 }}>
                <StyledButton name={'Close'} action={closeFrameEditor}/>
            </div>

        </div>
    );
}
