import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import { Button, Link,  Typography } from '@mui/material'
import {actions} from "../core/EditorFlow";
import {FC, useEffect} from "react";
import { PageState} from "../core/Enums";
import {useAuth0} from "@auth0/auth0-react";
import {api} from "../core/Api";
import {authAudienceUrl} from "../core/Urls";

export const Auth: FC = () => {
  const token = useSelector((state: RootStateOrAny) => state.editor.token)
  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: authAudienceUrl,
            scope: 'openid profile email',
          },
        });
        dispatch(actions.setToken(token))
      } catch (e) {
        console.error(e)
      }
    })()
  }, [getAccessTokenSilently])

  useEffect(()=> {
    if (token !== '') {
      // console.log(token)
      dispatch(api.endpoints.signIn.initiate())
    }
  }, [token])

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
        onClick={() => loginWithRedirect()}>
        {'SIGN IN / SIGN UP'}
      </Button>
      <Button
        id="live-demo" color="primary" variant='contained' fullWidth
        onClick={()=> {dispatch(actions.setPageState(PageState.DEMO))}}>
        {'LIVE DEMO'}
      </Button>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mapboard.io/">
          MapBoard
        </Link>
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </div>
  )
}
