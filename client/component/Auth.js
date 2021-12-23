import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import StyledButton from "../component-styled/StyledButton";
import StyledInput from "../component-styled/StyledInput";
import {COLORS} from "../core/Utils";
import { AUTH_PAGE_STATES } from '../core/EditorFlow'

let regEmail = '';
let regPassword = '';

export default function Auth() {
    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES

    const authPageState = useSelector(state => state.authPageState)
    const name = useSelector(state => state.name)
    const email = useSelector(state => state.email)
    const password = useSelector(state => state.password)
    const passwordAgain = useSelector(state => state.passwordAgain)

    const dispatch = useDispatch()
    const setName = e => dispatch({type: 'SET_NAME', payload: e.target.value})
    const setEmail = e => dispatch({type: 'SET_EMAIL', payload: e.target.value})
    const setPassword = e => dispatch({type: 'SET_PASSWORD', payload: e.target.value})
    const setPasswordAgain = e => dispatch({type: 'SET_PASSWORD_AGAIN', payload: e.target.value})

    // TODO convert these into glabal state
    const [confirmationCode, setConfirmationCode] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const signInPanel = _ => dispatch({type: 'SIGN_IN_PANEL'})
    const signUpPanel = _=> dispatch({type: 'SIGN_UP_PANEL'})
    const signUpStep1Panel = _ => dispatch({type: 'SIGN_UP_STEP_1_PANEL'})
    const signUpStep2Panel = _ => dispatch({type: 'SIGN_UP_STEP_2_PANEL'})

    const checkSignIn = () =>    {
        if (email === '' || password === '') {
            setFeedbackMessage('Missing information.')
        } else if (password.length < 5) {
            setFeedbackMessage('Too short password.')
        } else {
            dispatch({ type: 'SIGN_IN', payload: { cred: { email, password } } })
        }
    }
    const checkSignUpStep1 = () => {
        if (password.length < 5)  {
            setFeedbackMessage('Your password must be at least 5 characters.')
        } else {
            regEmail = email;
            regPassword = password;
            dispatch({type: 'SIGN_UP_STEP_1', payload: {name, email, password}});
        }
    }
    const checkSetConfirmationCode = (e) => {
        if (!isNaN(e.target.value) && e.target.value.length <= 4) {
            setConfirmationCode(e.target.value)
        }
    }
    const checkSignUpStep2 = () => {
        dispatch({type: 'SIGN_UP_STEP_2', payload: {email, confirmationCode}});
    }
    const liveDemo = _ => dispatch({type: 'LIVE_DEMO'})

    // TODO move this to the AUTH saga, and reuse the same setters and switchers that are being used by the app above
    // TODO after this is done, this can be left this way, and once the app grows it turns out what is a better arrangement
    // useEffect(() => {
    //     switch (serverResponse.cmd) {
    //         case 'signUpStep1FailEmailAlreadyInUse':    setFeedbackMessage('Email address already in use.'); break;
    //         case 'signUpStep1Success':                  switchSubMode(subTabValues[1]); break; // --> explicit mode by BE
    //         case 'signUpStep2FailUnknownUser':          setFeedbackMessage('Unknown User.'); break;
    //         case 'signUpStep2FailWrongCode':            setFeedbackMessage('Wrong code.'); break;
    //         case 'signUpStep2FailAlreadyActivated':     setFeedbackMessage('Already activated.'); break;
    //         case 'signUpStep2Success':                  switchMainMode(mainTabValues[0]); setEmail(regEmail); setPassword(regPassword); break; // explicit mode by BE
    //     }
    // }, [serverResponseCntr]);

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
            <Typography component="h1" variant="h5">MapBoard</Typography>
            <Typography component="h1" variant="h6">Private Beta</Typography>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
                <StyledButton
                    name="SIGN IN"
                    onClick={signUpPanel}
                    variant={authPageState === SIGN_IN ? 'contained' : 'outlined'}
                />
                <StyledButton
                    name="SIGN UP"
                    onClick={signInPanel}
                    variant={[SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) ? 'contained' : 'outlined'}
                />
            </div>
            {
                [SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) &&
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    <StyledButton
                        onClick={signUpStep1Panel}
                        name="STEP 1"
                        variant={authPageState === SIGN_UP_STEP_1 ? 'contained' : 'outlined'}
                    />
                    <StyledButton
                        onClick={signUpStep2Panel}
                        name="STEP 2"
                        variant={authPageState === SIGN_UP_STEP_2 ? 'contained' : 'outlined'}
                    />
                </div>
            }
            {
                authPageState === SIGN_IN && <>
                    <StyledInput label="Email"             value={email}            onChange={setEmail}                                 />
                    <StyledInput label="Password"          value={password}         onChange={setPassword}              type="password" />
                </>
            }
            {
                authPageState === SIGN_UP_STEP_1 && <>
                    <StyledInput label="Your First Name"   value={name}             onChange={setName}                  autoFocus       />
                    <StyledInput label="Email"             value={email}            onChange={setEmail}                                 />
                    <StyledInput label="Password"          value={password}         onChange={setPassword}                              />
                    <StyledInput label="Password Again"    value={passwordAgain}    onChange={setPasswordAgain}                         />
                </>
            }
            {
                authPageState === SIGN_UP_STEP_2 && <>
                    <StyledInput label="Email"             value={email}            onChange={setEmail}                                 />
                    <StyledInput label="Confirmation Code" value={confirmationCode} onChange={checkSetConfirmationCode} autoFocus       />

                </>
            }
            {
                feedbackMessage !== '' &&
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center">
                    {feedbackMessage}
                </Typography>
            }
            {
                authPageState === SIGN_IN &&
                <StyledButton
                    variant='contained'
                    fullWidth
                    onClick={checkSignIn}
                    name={'Sign In'}
                    disabled={false} // how to check if autofill happened?
                />
            }
            {
                authPageState === SIGN_UP_STEP_1 &&
                <StyledButton
                    variant='contained'
                    fullWidth
                    onClick={checkSignUpStep1}
                    name={'Get Confirmation Code'}
                    disabled={(name === '' || email === '' || password === '' || passwordAgain === '' || password !== passwordAgain)}/>
            }
            {
                authPageState === SIGN_UP_STEP_2 &&
                <StyledButton
                    variant='contained'
                    fullWidth
                    onClick={checkSignUpStep2}
                    name={'Enter Confirmation Code'}
                    disabled={(email === '' || confirmationCode === '' || confirmationCode.length !== 4)}
                />
            }
            <StyledButton variant='contained' fullWidth onClick={liveDemo} name={'LIVE DEMO'}/>
            <Typography
                variant="body2"
                color="textSecondary"
                align="center">
                {'Copyright © '}
                <Link color="inherit" href="http://mapboard.io/">
                    MapBoard
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </div>
    );
}
