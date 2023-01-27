import {useDispatch} from "react-redux";
import { Button, Link,  Typography } from '@mui/material'
import {actions} from "../core/EditorFlow";
import {FC} from "react";
import { PageState} from "../core/Types";
import {initDomData} from "../core/DomFlow";

export const Auth: FC = () => {

  const dispatch = useDispatch()
  return (
    <div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[384px] flex flex-col items-center inline-flex gap-4 p-5 rounded-2xl">
      <Typography color="primary" component="h1" variant="h5">
        {'MapBoard'}
      </Typography>
      <Typography color="primary" component="h1" variant="h6">
        {'Private Beta'}
      </Typography>
      <Button
        id="sign-in" color="primary" variant='contained' fullWidth
        disabled={false}
        onClick={() => {}}>
        {'SIGN IN / SIGN UP'}
      </Button>
      <Button
        id="live-demo" color="primary" variant='contained' fullWidth
        onClick={
          ()=> {
            initDomData()
            dispatch(actions.setPageState(PageState.DEMO))
          }
        }>
        {'LIVE DEMO'}
      </Button>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="http://mapboard.io/">
          MapBoard
        </Link>
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </div>
  )
}
