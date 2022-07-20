import {useSelector, useDispatch} from "react-redux";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { useState } from 'react'

export function CreateTable() {
    const [row, setRow] = useState(1)
    const [col, setCol] = useState(1)
    const interactionDisabled = useSelector(state => state.interactionDisabled)
    const dispatch = useDispatch()
    const showWs = _ => dispatch({type: 'SHOW_WS'})
    const insertTable = _=> dispatch({type: 'INSERT_TABLE', payload: {rowLen: row, colLen: col}})
    return(
        <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            {<div id="create-table">
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography variant="string" color='primary'>{'CREATE TABLE?'}</Typography>
                </div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small" variant="standard" >
                            <InputLabel>{'Row'}</InputLabel>
                            <Select value={row} onChange={e => setRow(e.target.value)}>
                                {[1,2,3,4,5,6,7,8,9,10].map((el, idx) => (
                                    <MenuItem value={el} key={idx}>{el}</MenuItem>
                                ))}>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small" variant="standard" >
                            <InputLabel>{'Column'}</InputLabel>
                            <Select value={col} onChange={e => setCol(e.target.value)}>
                                {[1,2,3,4,5,6,7,8,9,10].map((el, idx) => (
                                    <MenuItem value={el} key={idx}>{el}</MenuItem>
                                ))}>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button color="primary" variant='outlined' onClick={insertTable} disabled={interactionDisabled}>
                        {'OK'}
                    </Button>
                    <Button color="primary" variant='outlined' onClick={showWs} disabled={interactionDisabled}>
                        {'CANCEL'}
                    </Button>
                </div>
            </div>}
        </Modal>
    )
}
