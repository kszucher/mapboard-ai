import React from 'react'
import {useSelector, useDispatch} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import { getColors } from '../core/Colors'

export function ProfileEditor() {
    const colorMode = useSelector(state => state.colorMode)
    const name = useSelector(state => state.name)
    const dispatch = useDispatch()
    const closeProfile = _ => dispatch({type: 'CLOSE_PROFILE'})
    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            {<div
                style={{
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
                    backgroundColor: getColors(colorMode).MAP_BACKGROUND,
                    padding: 20,
                    borderColor: getColors(colorMode).MAP_BACKGROUND,
                    borderRadius: '16px'}}
            >
                <Typography
                    component="h1"
                    variant="h5">
                    {name}
                </Typography>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={closeProfile}>
                    {'CLOSE'}
                </Button>
            </div>}
        </Modal>
    )
}
