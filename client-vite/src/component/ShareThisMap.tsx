import {FC} from "react";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {actions, sagaActions} from '../core/EditorFlow'
import {Button, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography} from '@mui/material'
import {MapRight, PageState} from "../core/Types";

export const ShareThisMap: FC = () => {
  const shareEmail = useSelector((state: RootStateOrAny) => state.editor.shareEmail)
  const shareAccess = useSelector((state: RootStateOrAny) => state.editor.shareAccess)
  const shareFeedbackMessage = useSelector((state: RootStateOrAny) => state.editor.shareFeedbackMessage)
  const dispatch = useDispatch()
  return (
    <Modal open={true} onClose={_=>{}} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
      <div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[384px] flex flex-col items-center inline-flex gap-4 p-5 rounded-2xl">
        <Typography component="h1" variant="h5" color="primary">
          {'Share This Map'}
        </Typography>
        <TextField
          variant="outlined" fullWidth label="Share email"
          value={shareEmail}
          onChange={(e) => dispatch(actions.setShareEmail(e.target.value))}/>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
          <FormLabel component="legend">
            {'Access'}
          </FormLabel>
          <RadioGroup
            aria-label="my-aria-label" name="my-name" row={true}
            value={shareAccess}
            onChange={(e) => dispatch(actions.setShareAccess(e.target.value))}>
            {[MapRight.VIEW, MapRight.EDIT].map(
              (name, index) => <FormControlLabel value={name} control={<Radio />} label={name} key={index}/>
            )}
          </RadioGroup>
        </div>
        {shareFeedbackMessage !== '' &&
        <Typography variant="body2" color="textSecondary" align="center">
          {shareFeedbackMessage}
        </Typography>}
        <Button
          color="primary" variant="outlined"
          onClick={_=>dispatch(sagaActions.createShare(shareEmail, shareAccess))}
        >
          {'SHARE'}
        </Button>
        <Button
          color="primary" variant="outlined"
          onClick={_=>dispatch(actions.setPageState(PageState.WS))}>
          {'CLOSE'}
        </Button>
      </div>
    </Modal>
  )
}
