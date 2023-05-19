import React, {FC, useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography, SelectChangeEvent } from '@mui/material'
import {api} from "../core/Api";
import {actions, AppDispatch, RootState} from "../editor/EditorReducer"
import {PageState} from "../core/Enums"
import {getCountSC, getSXSCC0S, getSXSCR0S, getX, isSX, sortPath} from "../map/MapUtils"
import {getMap, mSelector} from "../state/EditorState"

export const ModalCreateGptNodes: FC = () => {
  const m = structuredClone(getMap()).sort(sortPath)
  const x = getX(m)
  const s = isSX(m)
  const hasC = getCountSC(m, x.path) > 0
  const [numNodes, setNumNodes] = useState<string>('1')
  const interactionDisabled = false
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal open={true} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg fixed top-[calc(48*2px)] right-[64px] w-[calc(6*32px)] flex flex-col gap-3 p-3 rounded-lg">
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <Typography variant='subtitle2' color='primary'>
            {'GENERATIVE AI'}
          </Typography>
        </div>

        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
          {
            s && !hasC &&
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small" variant="standard" >
                <InputLabel>
                  {'Suggestions'}
                </InputLabel>
                <Select
                  value={numNodes}
                  onChange={(event: SelectChangeEvent) => setNumNodes(event.target.value as string)}>
                  {[1,2,3,4,5,6,7,8,9,10].map((el, idx) => (
                    <MenuItem value={el} key={idx}>{el}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

          }
          {
            s && !hasC &&
            <Button
              color="primary"
              variant='outlined'
              disabled={interactionDisabled}
              fullWidth
              onClick={() => {
                dispatch(api.endpoints.getGptSuggestions.initiate({
                  prompt: `$List the top ${parseInt(numNodes)} to do for ${getX(getMap()).content}. Do not exceed 10 words per list item.`,
                  context: '',
                  content: getX(getMap()).content,
                  typeNodes: 's',
                  numNodes: parseInt(numNodes)
                }))
                dispatch(actions.setPageState(PageState.WS))
              }}>
              {'SUGGEST NODES'}
            </Button>
          }
          {
            s && hasC &&
            <Button
              color="primary"
              variant='outlined'
              disabled={interactionDisabled}
              fullWidth
              onClick={() => {
                const rowHeader = getSXSCR0S(m).map(el => el.content)
                const colHeader = getSXSCC0S(m).map(el => el.content)
                dispatch(api.endpoints.getGptSuggestions.initiate({
                  prompt: ` $Fill a table where header columns are [${rowHeader}] and header rows are [${colHeader}] as parseable 2D javascript string array`,
                  context: '',
                  content: getX(getMap()).content,
                  typeNodes: 'sc',
                  numNodes: rowHeader.length * colHeader.length
                }))
                dispatch(actions.setPageState(PageState.WS))
              }}>
              {'FILL TABLE'}
            </Button>
          }
          <Button
            color="primary"
            variant='outlined'
            disabled={interactionDisabled}
            fullWidth
            onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
            {'CANCEL'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
