import {useDispatch, useSelector} from "react-redux"
import {Button, CircularProgress, Link, ThemeProvider, Typography} from '@mui/material'
import {Features} from "../component-landing/Features";
import {Hero} from "../component-landing/Hero";
import {actions, AppDispatch, RootState} from "../core/EditorReducer"
import React, {FC, useEffect, useState} from "react"
import { PageState} from "../state/Enums"
import {useAuth0} from "@auth0/auth0-react"
import {api} from "../core/Api"
import {authAudienceUrl} from "../core/Urls"
import {getMuiTheme} from "./Mui"
import {setColors} from "./Colors"

export const Landing: FC = () => {
  const colorMode = 'dark'
  const token = useSelector((state: RootState) => state.editor.token)
  const [isWaiting, setIsWaiting] = useState(false)
  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setColors(colorMode)

    document.documentElement.classList.add('dark');


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
        })
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
    <>


      <Hero/>
      <Features/>

      <div className="mbg">


        <svg>
          <filter id='noiseFilter'>
            <feTurbulence
              type='fractalNoise'
              baseFrequency='6.29'
              numOctaves='6'
              stitchTiles='stitch'/>
          </filter>
        </svg>


      </div>
    </>


  )
}

// {/*// <ThemeProvider theme={getMuiTheme(colorMode)}>*/}
//
//
//
//
// {/*<div className="mbg">*/}
//
// {/*</div>*/}
// {/*<svg>*/}
// {/*  <filter id='noiseFilter'>*/}
// {/*    <feTurbulence*/}
// {/*      type='fractalNoise'*/}
// {/*      baseFrequency='6.29'*/}
// {/*      numOctaves='6'*/}
// {/*      stitchTiles='stitch'/>*/}
// {/*  </filter>*/}
// {/*</svg>*/}
//
//
//
// {/*<div className=" relative left-1/2 top-1/8 -translate-x-1/2  flex flex-col items-center inline-flex">*/}
// {/*  <div style={{fontFamily: 'Okta Neue', fontStyle: 'oblique', fontSize: 100, color: '#ffffff'}}>*/}
// {/*    <center>*/}
// {/*      <b>AI Visual Workflow</b>*/}
// {/*    </center>*/}
// {/*  </div>*/}
// {/*  <div style={{fontFamily: 'Okta Neue', fontSize: 40, color: '#ffffff'}}>*/}
// {/*    <center>*/}
// {/*      Transcribe <b>anything</b>,*/}
// {/*      <br/>*/}
// {/*      Think <b>visually</b>,*/}
// {/*      <br/>*/}
// {/*      Mark <b>done</b>.*/}
//
// {/*    </center>*/}
//
//
// {/*  </div>*/}
// {/*</div>*/}
//
//
// {/*<div className="_bg relative bottom-1/2 left-1/2 -translate-x-1/2 top-[40px] w-[640px] h-[160px] flex flex-col items-center inline-flex gap-4 p-5 rounded-lg">*/}
// {/*  <Typography color="primary" component="h1" variant="h5">*/}
// {/*    {'mapboard'}*/}
// {/*  </Typography>*/}
// {/*  <Typography color="primary" component="h1" variant="h6">*/}
// {/*    {'Private Beta'}*/}
// {/*  </Typography>*/}
// {/*  {*/}
// {/*    isWaiting*/}
// {/*      ?*/}
// {/*      <CircularProgress />*/}
// {/*      :*/}
// {/*      <Button*/}
// {/*        id="sign-in" color="primary" variant='contained' fullWidth*/}
// {/*        disabled={false}*/}
// {/*        onClick={() => loginWithRedirect()}>*/}
// {/*        {'SIGN IN / SIGN UP'}*/}
// {/*      </Button>*/}
// {/*  }*/}
// {/*  <Typography variant="body2" color="textSecondary" align="center">*/}
// {/*    {'Copyright © '}*/}
// {/*    <Link color="inherit" href="https://mapboard.io/">*/}
// {/*      MapBoard*/}
// {/*    </Link>*/}
// {/*    {' '}*/}
// {/*    {new Date().getFullYear()}*/}
// {/*    {'.'}*/}
// {/*  </Typography>*/}
// {/*</div>*/}
// {/*// </ThemeProvider>*/}
