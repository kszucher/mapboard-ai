import {useDispatch} from "react-redux";
import { Button, Link,  Typography } from '@mui/material'
import {actions} from "../core/EditorFlow";
import {FC, useEffect} from "react";
import { PageState} from "../core/Types";
import {initDomData} from "../core/DomFlow";
import {useAuth0} from "@auth0/auth0-react";
import {backendUrl} from "../core/Url";

export const Auth: FC = () => {
  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0()

  useEffect(() => {
    (async () => {
      const domain = "dev-gvarh14b.us.auth0.com";

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'http://local.mapboard/',
            scope: 'read:posts',
          },
        });
        console.log(token)
        // const response = await fetch('https://api.example.com/posts', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // setPosts(await response.json());
      } catch (e) {
        // Handle errors such as `login_required` and `consent_required` by re-prompting for a login
        console.error(e);
      }
    })();
  }, [getAccessTokenSilently]);


  // useEffect(() => {
  //   const getUserMetadata = async () => {
  //     const domain = "dev-gvarh14b.us.auth0.com";
  //
  //     const accessToken = await getAccessTokenSilently({
  //       authorizationParams: {
  //         audience: backendUrl,
  //         // scope: "read:current_user",
  //         scope: 'read:posts',
  //
  //       },
  //     })
  //   }
  //
  //     console.log(accessToken)
  //
  //
  //   }, [])

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
        onClick={() => loginWithRedirect()}>
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
