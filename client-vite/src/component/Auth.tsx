import {useDispatch, useSelector} from "react-redux"
import {Button, CircularProgress, Link, ThemeProvider, Typography} from '@mui/material'
import {actions, AppDispatch, RootState} from "../editor/EditorReducer"
import React, {FC, useEffect, useState} from "react"
import { PageState} from "../core/Enums"
import {useAuth0} from "@auth0/auth0-react"
import {api} from "../core/Api"
import {authAudienceUrl} from "../core/Urls"
import {getMuiTheme} from "./Mui"
import {setColors} from "../core/Colors"

export const Auth: FC = () => {
  const colorMode = 'dark'
  const token = useSelector((state: RootState) => state.editor.token)
  const [isWaiting, setIsWaiting] = useState(false)
  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setColors(colorMode)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        setIsWaiting(true)
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: authAudienceUrl,
            scope: 'openid profile email',
          },
        });
        dispatch(actions.setToken(token))
      } catch (e) {
        setIsWaiting(false)
        console.error(e)
      }
    })()
  }, [getAccessTokenSilently])

  useEffect(()=> {
    if (token !== '') {
      dispatch(api.endpoints.signIn.initiate())
    }
  }, [token])

  return (
    <ThemeProvider theme={getMuiTheme(colorMode)}>
      <div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[384px] flex flex-col items-center inline-flex gap-4 p-5 rounded-lg">
        <Typography color="primary" component="h1" variant="h5">
          {'MapBoard'}
        </Typography>
        <Typography color="primary" component="h1" variant="h6">
          {'Private Beta'}
        </Typography>
        {
          isWaiting
            ?
            <CircularProgress />
            :
            <Button
              id="sign-in" color="primary" variant='contained' fullWidth
              disabled={false}
              onClick={() => loginWithRedirect()}>
              {'SIGN IN / SIGN UP'}
            </Button>
        }
        {/*<Button*/}
        {/*  id="live-demo" color="primary" variant='contained' fullWidth*/}
        {/*  onClick={()=> {dispatch(actions.setPageState(PageState.DEMO))}}>*/}
        {/*  {'LIVE DEMO'}*/}
        {/*</Button>*/}
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
    </ThemeProvider>
  )
}
