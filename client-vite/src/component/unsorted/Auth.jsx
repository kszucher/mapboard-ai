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
            <Typography color="primary" component="h1" variant="h5">
                {'MapBoard'}
            </Typography>
            <Typography color="primary" component="h1" variant="h6">
                {'Private Beta'}
            </Typography>
            {
                [SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) &&
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    <Button id="step-1" color="primary" onClick={signUpStep1Panel}
                            variant={authPageState === SIGN_UP_STEP_1 ? 'contained' : 'outlined'}>
                        {'STEP 1'}
                    </Button>
                    <Button id="step2" color="primary" onClick={signUpStep2Panel}
                            variant={authPageState === SIGN_UP_STEP_2 ? 'contained' : 'outlined'}>
                        {'STEP 2'}
                    </Button>
                </div>
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <TextField id="your-first-name" variant="outlined" fullWidth label="Your First Name" value={name} onChange={setName} autoFocus/>
            }
            {
                [SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) &&
                <TextField id="email" variant="outlined" fullWidth label="Email" value={email} onChange={setEmail}/>
            }
            {
                [SIGN_IN, SIGN_UP_STEP_1].includes(authPageState) &&
                <TextField id="password" variant="outlined" fullWidth label="Password" value={password} onChange={setPassword} type="password"/>
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <TextField id="password-again" variant="outlined" fullWidth label="Password Again" value={passwordAgain} onChange={setPasswordAgain}/>
            }
            {
                authPageState === SIGN_UP_STEP_2 &&
                <TextField id="confirmation-code" variant="outlined" fullWidth label="Confirmation Code" value={confirmationCode} onChange={checkSetConfirmationCode} autoFocus/>
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <Button id="get-confirmation-code" color="primary" variant='contained' fullWidth onClick={signUpStep1}
                        disabled={name === '' || email === '' || password === '' || passwordAgain === '' || password !== passwordAgain}>
                    {'Get Confirmation Code'}
                </Button>
            }
            {
                authPageState === SIGN_UP_STEP_2 &&
                <Button id="enter-confirmation-code" color="primary" variant='contained' fullWidth onClick={signUpStep2}
                        disabled={email === '' || confirmationCode === '' || confirmationCode.length !== 4}>
                    {'Enter Confirmation Code'}
                </Button>
            }
            {
                authPageState === SIGN_IN &&
                <Button id="sign-in" color="primary" variant='contained' fullWidth onClick={signIn} disabled={false}>
                    {'SIGN IN'}
                </Button>
            }
            {
                authFeedbackMessage !== '' &&
                <Typography id="auth-feedback-message" variant="body2" color="textSecondary" align="center">
                    {authFeedbackMessage}
                </Typography>
            }
            {
                [SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) &&
                <Button id="sign-in-instead" fullWidth color="primary" onClick={signInPanel} variant="outlined">
                    {'SIGN IN INSTEAD'}
                </Button>
            }
            {
                authPageState === SIGN_IN &&
                <Button id="sign-up-instead" fullWidth color="primary" onClick={signUpPanel} variant="outlined">
                    {'SIGN UP INSTEAD'}
                </Button>
            }
            <Button id="live-demo" color="primary" variant='contained' fullWidth onClick={liveDemo}>
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

// CYPRESS
// step-1
// step-2
// your-first-name
// email
// password
// password-again
// confirmation-code
// get-confirmation-code
// enter-confirmation-code
// sign-in
// auth-feedback-message
// sign-in-instead
// sign-up-instead
// live-demo
