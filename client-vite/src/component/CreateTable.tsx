import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography, SelectChangeEvent } from '@mui/material'
import { useState } from 'react'
import {actions, PageState, sagaActions} from "../core/EditorFlow";

export function CreateTable() {
    const [row, setRow] = useState('1')
    const [col, setCol] = useState('1')
    const interactionDisabled = useSelector((state: RootStateOrAny) => state.interactionDisabled)
    const dispatch = useDispatch()
    return (
        <Modal open={true} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div className="_bg fixed top-[calc(48*2px)] right-[64px] w-[calc(6*32px)] flex flex-col gap-3 p-3 rounded-2xl">
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography variant='subtitle2' color='primary'>
                        {'CREATE TABLE?'}
                    </Typography>
                </div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small" variant="standard" >
                            <InputLabel>
                                {'Row'}
                            </InputLabel>
                            <Select value={row}
                                    onChange={(event: SelectChangeEvent) => setRow(event.target.value as string)}>
                                {[1,2,3,4,5,6,7,8,9,10].map((el, idx) => (
                                    <MenuItem value={el} key={idx}>{el}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth size="small" variant="standard" >
                            <InputLabel>
                                {'Column'}
                            </InputLabel>
                            <Select value={col}
                                    onChange={(event: SelectChangeEvent) => setCol(event.target.value as string)}>
                                {[1,2,3,4,5,6,7,8,9,10].map((el, idx) => (
                                    <MenuItem value={el} key={idx}>{el}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Button color="primary" variant='outlined' disabled={interactionDisabled}
                            onClick={_=>dispatch(sagaActions.insertTable(parseInt(row), parseInt(col)))}>
                        {'OK'}
                    </Button>
                    <Button color="primary" variant='outlined' disabled={interactionDisabled}
                            onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
                        {'CANCEL'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
