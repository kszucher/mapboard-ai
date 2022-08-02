import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography, SelectChangeEvent } from '@mui/material'
import { useState } from 'react'

export function CreateTable() {
    const [row, setRow] = useState('1')
    const [col, setCol] = useState('1')
    const interactionDisabled = useSelector((state: RootStateOrAny) => state.interactionDisabled)
    const dispatch = useDispatch()
    const showWs = () => dispatch({type: 'SHOW_WS'})
    const insertTable = () => dispatch({type: 'INSERT_TABLE', payload: {rowLen: parseInt(row), colLen: parseInt(col)}})
    return(
        <Modal
            open={true}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div id="create-table">
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography variant='subtitle2' color='primary'>{'CREATE TABLE?'}</Typography>
                </div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small" variant="standard" >
                            <InputLabel>{'Row'}</InputLabel>
                            <Select
                                value={row}
                                onChange={(event: SelectChangeEvent) => setRow(event.target.value as string)}
                            >
                                {
                                    [1,2,3,4,5,6,7,8,9,10].map((el, idx) => (
                                        <MenuItem value={el} key={idx}>{el}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small" variant="standard" >
                            <InputLabel>{'Column'}</InputLabel>
                            <Select
                                value={col}
                                onChange={(event: SelectChangeEvent) => setCol(event.target.value as string)}
                            >
                                {
                                    [1,2,3,4,5,6,7,8,9,10].map((el, idx) => (
                                        <MenuItem value={el} key={idx}>{el}</MenuItem>
                                    ))
                                }
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
            </div>
        </Modal>
    )
}
