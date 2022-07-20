import {useSelector, useDispatch} from "react-redux";
import { AUTH_PAGE_STATES } from '../../core/EditorFlow'
import { Button, Link, TextField, Typography } from '@mui/material'

export default function Auth() {
    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES
    const authPageState = useSelector(state => state.authPageState)
    const name = useSelector(state => state.name)
    const email = useSelector(state => state.email)
    const password = useSelector(state => state.password)
    const passwordAgain = useSelector(state => state.passwordAgain)
    const confirmationCode = useSelector(state => state.confirmationCode)
    const authFeedbackMessage = useSelector(state => state.authFeedbackMessage)
    const getConfirmationCodeDisabled = (name === '' || email === '' || password === '' || passwordAgain === '' || password !== passwordAgain)
    const enterConfirmationCodeDisabled = (email === '' || confirmationCode === '' || confirmationCode.length !== 4)
    const dispatch = useDispatch()
    const setName = e => dispatch({type: 'SET_NAME', payload: e.target.value})
    const setEmail = e => dispatch({type: 'SET_EMAIL', payload: e.target.value})
    const setPassword = e => dispatch({type: 'SET_PASSWORD', payload: e.target.value})
    const setPasswordAgain = e => dispatch({type: 'SET_PASSWORD_AGAIN', payload: e.target.value})
    const checkSetConfirmationCode = e => dispatch({type: 'CHECK_SET_CONFIRMATION_CODE', payload: e.target.value})
    const signInPanel = _ => dispatch({type: 'SIGN_IN_PANEL'})
    const signUpPanel = _ => dispatch({type: 'SIGN_UP_PANEL'})
    const signUpStep1Panel = _ => dispatch({type: 'SIGN_UP_STEP_1_PANEL'})
    const signUpStep2Panel = _ => dispatch({type: 'SIGN_UP_STEP_2_PANEL'})
    const signIn = _ => dispatch({type: 'SIGN_IN', payload: { cred: { email, password } }})
    const signUpStep1 = _ => dispatch({type: 'SIGN_UP_STEP_1', payload: { name, email, password }});
    const signUpStep2 = _ => dispatch({type: 'SIGN_UP_STEP_2', payload: { email, confirmationCode }});
    const liveDemo = _ => dispatch({type: 'LIVE_DEMO'})
    return (
        <div id="auth">
            <Typography component="h1" variant="h5">
                {'MapBoard'}
            </Typography>
            <Typography component="h1" variant="h6">
                {'Private Beta'}
            </Typography>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
                <Button color="primary" onClick={signInPanel} variant={authPageState === SIGN_IN ? 'contained' : 'outlined'}>
                    {'SIGN IN'}
                </Button>
                <Button color="primary" onClick={signUpPanel} variant={[SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) ? 'contained' : 'outlined'}>
                    {'SIGN UP'}
                </Button>
            </div>
            {
                [SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) &&
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    <Button color="primary" onClick={signUpStep1Panel} variant={authPageState === SIGN_UP_STEP_1 ? 'contained' : 'outlined'}>
                        {'STEP 1'}
                    </Button>
                    <Button color="primary" onClick={signUpStep2Panel} variant={authPageState === SIGN_UP_STEP_2 ? 'contained' : 'outlined'}>
                        {'STEP 2'}
                    </Button>
                </div>
            }
            {
                authPageState === SIGN_IN &&
                <>
                    <TextField variant="outlined" fullWidth label="Email" value={email} onChange={setEmail}/>
                    <TextField variant="outlined" fullWidth label="Password" value={password} onChange={setPassword} type="password"/>
                </>
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <>
                    <TextField variant="outlined" fullWidth label="Your First Name" value={name} onChange={setName} autoFocus/>
                    <TextField variant="outlined" fullWidth label="Email" value={email} onChange={setEmail}/>
                    <TextField variant="outlined" fullWidth label="Password" value={password} onChange={setPassword}/>
                    <TextField variant="outlined" fullWidth label="Password Again" value={passwordAgain} onChange={setPasswordAgain}/>
                </>
            }
            {
                authPageState === SIGN_UP_STEP_2 &&
                <>
                    <TextField variant="outlined" fullWidth label="Email" value={email} onChange={setEmail}/>
                    <TextField variant="outlined" fullWidth label="Confirmation Code" value={confirmationCode} onChange={checkSetConfirmationCode} autoFocus/>
                </>
            }
            {
                authFeedbackMessage !== '' &&
                <Typography variant="body2" color="textSecondary" align="center">
                    {authFeedbackMessage}
                </Typography>
            }
            {
                authPageState === SIGN_IN &&
                <Button color="primary" variant='contained' fullWidth onClick={signIn} disabled={false}>
                    {'SIGN IN'}
                </Button>
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <Button color="primary" variant='contained' fullWidth onClick={signUpStep1} disabled={getConfirmationCodeDisabled}>
                    {'Get Confirmation Code'}
                </Button>
            }
            {
                authPageState === SIGN_UP_STEP_2 &&
                <Button color="primary" variant='contained' fullWidth onClick={signUpStep2} disabled={enterConfirmationCodeDisabled}>
                    {'Enter Confirmation Code'}
                </Button>
            }
            <Button color="primary" variant='contained' fullWidth onClick={liveDemo}>
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
