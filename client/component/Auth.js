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

const mainTabValues = ['Sign In', 'Sign Up'];
const subTabValues = ['Step 1', 'Step 2'];

export default function Auth() {

    const {SIGN_IN, SIGN_UP_STEP_1, SIGN_UP_STEP_2} = AUTH_PAGE_STATES

    const authPageState = useSelector(state => state.authPageState)

    const dispatch = useDispatch()
    const setAuthPageState = value => dispatch({type: 'SET_AUTH_PAGE_STATE', payload: value})



    const [mainTabValue, setMainTabValue] = useState(0);
    const [subTabValue, setSubTabValue] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const typeName = (e) => {setName(e.target.value)}
    const typeEmail = (e) => {setEmail(e.target.value)}
    const typePassword = (e) => {setPassword(e.target.value)}
    const typePasswordAgain = (e) => {setPasswordAgain(e.target.value)}
    const typeConfirmationCode = (e) => {if (!isNaN(e.target.value) && e.target.value.length <= 4) {setConfirmationCode(e.target.value)}}
    const liveDemo = (e) => {dispatch({type: 'LIVE_DEMO'})}

    const switchMainMode = (e) => {
        if (e !== mainTabValues[mainTabValue]) {
            setMainTabValue(!mainTabValue & 1);
            if (mainTabValue) setSubTabValue(0);



            setName('');
            setEmail('')
            setPassword('');
            setPasswordAgain('');
            setConfirmationCode('');
            setFeedbackMessage('');
        }
    }
    const switchSubMode = (e) => {
        if (e !== subTabValues[subTabValue]) {
            setSubTabValue(!subTabValue & 1);


            setPassword('');
            setPasswordAgain('');
            setConfirmationCode('');
            setFeedbackMessage('');
        }
    }
    const signInHandler = () =>    {
        if (email === '' || password === '') {
            setFeedbackMessage('Missing information.')
        } else if (password.length < 5) {
            setFeedbackMessage('Too short password.')
        } else {
            let cred = {email, password}
            localStorage.setItem('cred', JSON.stringify(cred))
            dispatch({type: 'SIGN_IN'})
        }
    }
    const signUpStep1Handler = () => {
        if (password.length < 5)  {
            setFeedbackMessage('Your password must be at least 5 characters.')
        } else {
            regEmail = email;
            regPassword = password;
            dispatch({type: 'SIGN_UP_STEP_1', payload: {name, email, password}});
        }
    }
    const signUpStep2Handler = () => {
        dispatch({type: 'SIGN_UP_STEP_2', payload: {email, confirmationCode}});
    }
    const signAction = () => {
        switch (authPageState) {
            case SIGN_IN: return signInHandler()
            case SIGN_UP_STEP_1: return signUpStep1Handler()
            case SIGN_UP_STEP_2: return  signUpStep2Handler()
        }
    }
    const signActionDisabled = () => {
        return authPageState === SIGN_IN
            ? false // (email === '' || password === '') // autofill issue
            : (authPageState === SIGN_UP_STEP_1
                ? (name === '' || email === '' || password === '' || passwordAgain === '' || password !== passwordAgain)
                : (email === '' || confirmationCode === '' || confirmationCode.length !== 4)
            )
    }
    const signActionText = () => {
        switch (authPageState) {
            case SIGN_IN: return 'Sign In'
            case SIGN_UP_STEP_1: return 'Get Confirmation Code'
            case SIGN_UP_STEP_2: return  'Enter Confirmation Code'
        }
    }

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
                    onClick={_=>setAuthPageState(SIGN_IN)}
                    name="SIGN IN"
                    variant={authPageState === SIGN_IN ? 'contained' : 'outlined'}
                />
                <StyledButton
                    onClick={_=>setAuthPageState(SIGN_UP_STEP_1)}
                    name="SIGN UP"
                    variant={[SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) ? 'contained' : 'outlined'}
                />
            </div>

            {[SIGN_UP_STEP_1, SIGN_UP_STEP_2].includes(authPageState) &&
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <StyledButton
                    onClick={_ => setAuthPageState(SIGN_UP_STEP_1)}
                    name="STEP 1"
                    variant={authPageState === SIGN_UP_STEP_1 ? 'contained' : 'outlined'}
                />
                <StyledButton
                    onClick={_ => setAuthPageState(SIGN_UP_STEP_2)}
                    name="STEP 2"
                    variant={authPageState === SIGN_UP_STEP_2 ? 'contained' : 'outlined'}
                />
            </div>}

            <StyledInput open={authPageState === SIGN_UP_STEP_1} label="Your First Name"   value={name}             onChange={typeName}              autoFocus       />
            <StyledInput open={true}                             label="Email"             value={email}            onChange={typeEmail}                             />
            <StyledInput open={authPageState !== SIGN_UP_STEP_2} label="Password"          value={password}         onChange={typePassword}          type="password" />
            <StyledInput open={authPageState === SIGN_UP_STEP_1} label="Password Again"    value={passwordAgain}    onChange={typePasswordAgain}     type="password" />
            <StyledInput open={authPageState === SIGN_UP_STEP_2} label="Confirmation Code" value={confirmationCode} onChange={typeConfirmationCode}                  />
            {
                feedbackMessage !== '' &&
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center">
                    {feedbackMessage}
                </Typography>
            }
            <StyledButton variant='contained' fullWidth onClick={signAction} name={signActionText()} disabled={signActionDisabled()}/>
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
