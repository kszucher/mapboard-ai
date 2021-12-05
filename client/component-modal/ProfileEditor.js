import React, {useEffect} from 'react'
import {useSelector, useDispatch} from "react-redux";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import {COLORS} from "../core/Utils";
import StyledButton from '../component-styled/StyledButton'

export function ProfileEditor() {
    const profileName = useSelector(state => state.profileName)
    const dispatch = useDispatch()
    const closeProfile = _ => dispatch({type: 'CLOSE_PROFILE'})
    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            {<div style={{
                position: 'relative',
                left: '50%',
                transform: 'translate(-50%)',
                top: 96,
                // maxWidth: 'fit-content',
                width: 200+250+140+140+200,
                // height: 1200,
                flexDirection: 'column',
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                backgroundColor: COLORS.MAP_BACKGROUND,
                padding: 20,
                border: `1px solid ${COLORS.MAP_BACKGROUND}`,
                borderRadius: '16px'}}>
                <Typography
                    component="h1"
                    variant="h5">
                    {profileName}
                </Typography>
                <StyledButton
                    version="shortOutlined"
                    disabled={false}
                    action={closeProfile}
                    name={'close'}
                />
            </div>}
        </Modal>
    )
}
