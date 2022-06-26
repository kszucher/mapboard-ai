import {useSelector, useDispatch} from "react-redux";
import { Button, Modal, Typography } from '@mui/material'
import { getColors } from '../core/Colors'

export function CreateMapInMap() {
    const colorMode = useSelector(state => state.colorMode)
    const {PAGE_BACKGROUND, MAP_BACKGROUND} = getColors(colorMode)
    const dispatch = useDispatch()
    const showWs = _ => dispatch({type: 'SHOW_WS'})
    const createMapInMap = _ => dispatch({type: 'CREATE_MAP_IN_MAP'})
    return(
        <Modal
            open={true}
            onClose={_=>{}}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            {<div
                style={{
                    position: 'fixed',
                    top: 48*2,
                    right: 64,
                    width: 6*32,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 16,
                    background: MAP_BACKGROUND,
                    border: `1px solid ${PAGE_BACKGROUND}`,
                    flexWrap: 'wrap',
                    gap: 12,
                    padding: '12px 12px 12px 12px'
                }}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography variant="string" color='primary'>{'CREATE SUBMAP?'}</Typography>
                </div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Button color="primary" variant='outlined' onClick={createMapInMap}>{'OK'}</Button>
                    <Button color="primary" variant='outlined' onClick={showWs}>{'CANCEL'}</Button>
                </div>
            </div>}
        </Modal>
    )
}
