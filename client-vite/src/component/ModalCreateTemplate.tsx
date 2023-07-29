import {FC, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography, SelectChangeEvent } from '@mui/material'
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import {Templates} from "../core/MapInsert";
import {PageState} from "../state/Enums"
import {mSelector} from "../state/EditorState"

export const ModalCreateTemplate: FC = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const [fromSide, setFromSide] = useState<string>(Templates.empty)
  const interactionDisabled = false
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal open={true} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg fixed top-[calc(48*2px)] right-[64px] w-[calc(6*32px)] flex flex-col gap-3 p-3 rounded-lg">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant='subtitle2' color='primary'>
            {'CREATE TEMPLATE?'}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small" variant="standard" >
              <InputLabel>
                {'From'}
              </InputLabel>
              <Select
                value={fromSide}
                onChange={(event: SelectChangeEvent) => setFromSide(event.target.value as string)}>
                {Object.values(Templates).map((el, idx) => (
                  <MenuItem value={el} key={idx}>{el}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            color="primary"
            variant='outlined'
            disabled={interactionDisabled}
            onClick={() => {
              // dispatch(actions.mapAction({type: 'createConnector', payload: {fromSide, toSide}}))
              dispatch(actions.setPageState(PageState.WS))
            }}>
            {'OK'}
          </Button>
          <Button
            color="primary"
            variant='outlined'
            disabled={interactionDisabled}
            onClick={() =>
              dispatch(actions.setPageState(PageState.WS))
            }>{'CANCEL'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
