import React, {useContext, useEffect, useState} from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";
import StyledInput from "../component-styled/StyledInput";
import {COLORS} from "../core/Utils";

let regEmail = '';
let regPassword = '';

export default function Auth() {
    const mainTabValues = ['Sign In', 'Sign Up'];
    const subTabValues = ['Step 1', 'Step 2'];

    const [state, dispatch] = useContext(Context);
    const {serverResponseToUser} = state;
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
    const showLiveDemo = (e) => {dispatch({type: 'SHOW_DEMO'})}
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
            dispatch({type: 'SIGN_IN', payload: cred})
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
        mainTabValue === 0
            ? signInHandler()
            : (subTabValue === 0
                ? signUpStep1Handler()
                : signUpStep2Handler()
            )
    }
    const signActionDisabled = () => {
        return mainTabValue === 0
            ? false // (email === '' || password === '') // autofill issue
            : (subTabValue === 0
                ? (name === '' || email === '' || password === '' || passwordAgain === '' || password !== passwordAgain)
                : (email === '' || confirmationCode === '' || confirmationCode.length !== 4)
            )
    }
    const signActionText = () => {
        return mainTabValue === 0 ? 'Sign In' : (subTabValue === 0 ? 'Get Confirmation Code' : 'Enter Confirmation Code')
    }

    useEffect(() => {
        let lastResponse = [...serverResponseToUser].pop();
        switch (lastResponse) {
            case 'signUpStep1FailEmailAlreadyInUse':    setFeedbackMessage('Email address already in use.'); break;
            case 'signUpStep1Success':                  switchSubMode(subTabValues[1]); break;
            case 'signUpStep2FailUnknownUser':          setFeedbackMessage('Unknown User.'); break;
            case 'signUpStep2FailWrongCode':            setFeedbackMessage('Wrong code.'); break;
            case 'signUpStep2FailAlreadyActivated':     setFeedbackMessage('Already activated.'); break;
            case 'signUpStep2Success':
                switchMainMode(mainTabValues[0]);
                setEmail(regEmail);
                setPassword(regPassword);
                break;
        }
    }, [serverResponseToUser]);

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
            <StyledButtonGroup open={true}                                 valueList={mainTabValues} value={mainTabValues[mainTabValue]} action={switchMainMode}/>
            <StyledButtonGroup open={mainTabValue===1}                     valueList={subTabValues}  value={subTabValues[subTabValue]}   action={switchSubMode}/>
            <StyledInput       open={mainTabValue===1 && subTabValue===0}  label="Your First Name"   value={name}                        action={typeName}              autoFocus/>
            <StyledInput       open={true}                                 label="Email"             value={email}                       action={typeEmail}/>
            <StyledInput       open={subTabValue===0}                      label="Password"          value={password}                    action={typePassword}          type="password"/>
            <StyledInput       open={mainTabValue===1 && subTabValue===0}  label="Password Again"    value={passwordAgain}               action={typePasswordAgain}     type="password"/>
            <StyledInput       open={mainTabValue===1 && subTabValue===1}  label="Confirmation Code" value={confirmationCode}            action={typeConfirmationCode}/>
            {feedbackMessage !== '' && <Typography
                variant="body2"
                color="textSecondary"
                align="center">
                {feedbackMessage}
            </Typography>}
            <StyledButton version="longContained" disabled={signActionDisabled()} action={signAction}   name={signActionText()}/>
            <StyledButton version="longContained" disabled={false}                action={showLiveDemo} name={'LIVE DEMO'}/>
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
