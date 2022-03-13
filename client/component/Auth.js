import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import { AUTH_PAGE_STATES } from '../core/EditorFlow'
import { Button, Link, TextField, Typography } from '@mui/material'
import { COLORS } from '../core/Colors'

export default function Auth() {
    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES
    const authPageState = useSelector(state => state.authPageState)
    const name = useSelector(state => state.name)
    const email = useSelector(state => state.email)
    const password = useSelector(state => state.password)
    const passwordAgain = useSelector(state => state.passwordAgain)
    const confirmationCode = useSelector(state => state.confirmationCode)
    const authFeedbackMessage = useSelector(state => state.authFeedbackMessage)
    const dispatch = useDispatch()
    const setName = e => dispatch({type: 'SET_NAME', payload: e.target.value})
    const setEmail = e => dispatch({type: 'SET_EMAIL', payload: e.target.value})
    const setPassword = e => dispatch({type: 'SET_PASSWORD', payload: e.target.value})
    const setPasswordAgain = e => dispatch({type: 'SET_PASSWORD_AGAIN', payload: e.target.value})
    const setConfirmationCode = e => dispatch({type: 'SET_CONFIRMATION_CODE', payload: e.target.value})
    const setAuthFeedbackMessage = value => dispatch({type: 'SET_AUTH_FEEDBACK_MESSAGE', payload: value})
    const signInPanel = _ => dispatch({type: 'SIGN_IN_PANEL'})
    const signUpPanel = _ => dispatch({type: 'SIGN_UP_PANEL'})
    const signUpStep1Panel = _ => dispatch({type: 'SIGN_UP_STEP_1_PANEL'})
    const signUpStep2Panel = _ => dispatch({type: 'SIGN_UP_STEP_2_PANEL'})
    const signIn = _ => dispatch({ type: 'SIGN_IN', payload: {cred: { email, password }}})
    const signUpStep1 = _ => dispatch({type: 'SIGN_UP_STEP_1', payload: { name, email, password }});
    const signUpStep2 = _ => dispatch({type: 'SIGN_UP_STEP_2', payload: { email, confirmationCode }});
    const liveDemo = _ => dispatch({type: 'LIVE_DEMO'})

    const checkSignIn = () =>    {
        if (email === '' || password === '') {
            setAuthFeedbackMessage('Missing information')
        } else if (password.length < 5) {
            setAuthFeedbackMessage('Too short password')
        } else {
            signIn()
        }
    }
    const checkSignUpStep1 = () => {
        if (password.length < 5)  {
            setAuthFeedbackMessage('Your password must be at least 5 characters')
        } else {
            signUpStep1()
        }
    }
    const checkSetConfirmationCode = (e) => {
        if (!isNaN(e.target.value) && e.target.value.length <= 4) {
            setConfirmationCode(e)
        }
    }

    return (
        <div
            style={{
                position: 'relative',
                left: '50%',
                transform: 'translate(-50%)',
                top: 96,
                width: 48*8,
                flexDirection: 'column',
                alignItems: 'center',
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: 16,
                backgroundColor: COLORS.MAP_BACKGROUND,
                padding: 20,
                border: `1px solid ${COLORS.MAP_BACKGROUND}`,
                borderRadius: '16px'
            }}>
            <Typography component="h1"
                        variant="h5">
                {'MapBoard'}
            </Typography>
            <Typography component="h1"
                        variant="h6">
                {'Private Beta'}
            </Typography>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
                <Button color="primary"
                        onClick={signInPanel}
                        variant={authPageState === SIGN_IN ? 'contained' : 'outlined'}>
                    {'SIGN IN'}
                </Button>
                <Button color="primary"
                        onClick={signUpPanel}
                        variant={[SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) ? 'contained' : 'outlined'}>
                    {'SIGN UP'}
                </Button>
            </div>
            {
                [SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) &&
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    <Button color="primary"
                            onClick={signUpStep1Panel}
                            variant={authPageState === SIGN_UP_STEP_1 ? 'contained' : 'outlined'}>
                        {'STEP 1'}
                    </Button>
                    <Button color="primary"
                            onClick={signUpStep2Panel}
                            variant={authPageState === SIGN_UP_STEP_2 ? 'contained' : 'outlined'}>
                        {'STEP 2'}
                    </Button>
                </div>
            }
            {
                authPageState === SIGN_IN &&
                <>
                    <TextField variant="outlined"
                               fullWidth
                               label="Email"
                               value={email}
                               onChange={setEmail}/>
                    <TextField variant="outlined"
                               fullWidth
                               label="Password"
                               value={password}
                               onChange={setPassword}
                               type="password"/>
                </>
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <>
                    <TextField variant="outlined"
                               fullWidth
                               label="Your First Name"
                               value={name}
                               onChange={setName}
                               autoFocus/>
                    <TextField variant="outlined"
                               fullWidth
                               label="Email"
                               value={email}
                               onChange={setEmail}/>
                    <TextField variant="outlined"
                               fullWidth
                               label="Password"
                               value={password}
                               onChange={setPassword}/>
                    <TextField variant="outlined"
                               fullWidth
                               label="Password Again"
                               value={passwordAgain}
                               onChange={setPasswordAgain}/>
                </>
            }
            {
                authPageState === SIGN_UP_STEP_2 &&
                <>
                    <TextField variant="outlined"
                               fullWidth
                               label="Email"
                               value={email}
                               onChange={setEmail}/>
                    <TextField variant="outlined"
                               fullWidth
                               label="Confirmation Code"
                               value={confirmationCode}
                               onChange={checkSetConfirmationCode}
                               autoFocus/>
                </>
            }
            {
                authFeedbackMessage !== '' &&
                <Typography variant="body2"
                            color="textSecondary"
                            align="center">
                    {authFeedbackMessage}
                </Typography>
            }
            {
                authPageState === SIGN_IN &&
                <Button color="primary"
                        variant='contained'
                        fullWidth
                        onClick={checkSignIn}
                        disabled={false}>
                    {'SIGN IN'}
                </Button>
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <Button color="primary"
                        variant='contained'
                        fullWidth
                        onClick={checkSignUpStep1}
                        disabled={(
                            name === '' ||
                            email === '' ||
                            password === '' ||
                            passwordAgain === '' ||
                            password !== passwordAgain
                        )}>
                    {'Get Confirmation Code'}
                </Button>
            }
            {
                authPageState === SIGN_UP_STEP_2 &&
                <Button color="primary"
                        variant='contained'
                        fullWidth
                        onClick={signUpStep2}
                        name={'Enter Confirmation Code'}
                        disabled={(
                            email === '' ||
                            confirmationCode === '' ||
                            confirmationCode.length !== 4)}
                />
            }
            <Button color="primary"
                    variant='contained'
                    fullWidth
                    onClick={liveDemo}>
                {'LIVE DEMO'}
            </Button>
            <Typography
                variant="body2"
                color="textSecondary"
                align="center">
                {'Copyright © '}
                <Link color="inherit"
                      href="http://mapboard.io/">
                    MapBoard
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </div>
    )
}
