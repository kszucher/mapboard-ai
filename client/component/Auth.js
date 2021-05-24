import React, {useContext, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {Context} from "../core/Store";
import StyledInput from "../component-styled/StyledInput";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export default function Auth() {
    const mainTabValues = ['Sign In', 'Sign Up'];
    const subTabValues = ['Step 1', 'Step 2'];

    const [mainTabValue, setMainTabValue] = useState(0);
    const [subTabValue, setSubTabValue] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const [state, dispatch] = useContext(Context);
    const {serverResponseToUser} = state;

    const typeName = (e) =>             setName(e.target.value)
    const typeEmail = (e) =>            setEmail(e.target.value)
    const typePassword = (e) =>         setPassword(e.target.value)
    const typePasswordAgain = (e) =>    setPasswordAgain(e.target.value)
    const typeConfirmationCode = (e) => {
        if (!isNaN(e.target.value) && e.target.value.length <= 4) {
            setConfirmationCode(e.target.value)
        }
    }

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
        if (password.length < 5) {
            setFeedbackMessage('Too short password.')
        } else {
            dispatch({type: 'SIGN_IN', payload: {email, password}})
        }
    }
    const signUpStep1Handler = () => {
        if (password.length < 5)  {
            setFeedbackMessage('Your password must be at least 5 characters.')
        } else {
            dispatch({type: 'SIGN_UP', payload: {name, email, password}});
        }
    }
    const signUpStep2Handler = () => {  console.log('checking confirmation code...')}

    useEffect(() => {
        let lastResponse = [...serverResponseToUser].pop();
        switch (lastResponse) {
            case 'signUpFailEmailAlreadyInUse': setFeedbackMessage('Email address already in use.'); break;
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
                border: "1px solid #fbfafc",
                borderRadius: '16px',
                backgroundColor: '#fbfafc',
                padding: 20,
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: 16,
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            <Typography component="h1" variant="h5">MindBoard</Typography>
            <Typography component="h1" variant="h6">Private Beta</Typography>
            <StyledButtonGroup
                value={mainTabValues[mainTabValue]}
                valueList={mainTabValues}
                action={switchMainMode}
            />
            {mainTabValue===1 && <StyledButtonGroup
                value={subTabValues[subTabValue]}
                valueList={subTabValues}
                action={switchSubMode}
            />}
            {mainTabValue===1 && subTabValue===0 && <StyledInput
                value={name}
                label="Your First Name"
                onChange={typeName}
                autoFocus={true} />
            }
            <StyledInput
                value={email}
                label="Email"
                onChange={typeEmail}
            />
            {subTabValue===0 && <StyledInput
                value={password}
                label="Password"
                onChange={typePassword}
                type="password"
            />}
            {mainTabValue===1 && subTabValue===0 && <StyledInput
                value={passwordAgain}
                label="Password Again"
                onChange={typePasswordAgain}
                type="password"
            />}
            {mainTabValue===1 && subTabValue===1 && <StyledInput
                value={confirmationCode}
                label="Confirmation Code"
                onChange={typeConfirmationCode}
            />}
            {feedbackMessage !== '' && <Typography
                variant="body2"
                color="textSecondary"
                align="center">
                {feedbackMessage}
            </Typography>}
            <Button
                variant="contained"
                fullWidth
                type="submit"
                color="primary"
                disabled={
                    mainTabValue === 0
                        ? false
                        : (subTabValue === 0
                            ? (name === '' || email === '' || password === '' || passwordAgain === '' || password !== passwordAgain)
                            : (email === '' || confirmationCode === '' || confirmationCode.length !== 4)
                        )
                }
                onClick={
                    mainTabValue === 0
                        ? signInHandler
                        : (subTabValue === 0
                            ? signUpStep1Handler
                            : signUpStep2Handler
                        )
                }>
                {
                    mainTabValue === 0
                        ? 'Sign In'
                        : (subTabValue === 0
                            ? 'Get Confirmation Code'
                            : 'Enter Confirmation Code'
                        )
                }
            </Button>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="http://mindboard.io/">
                    MindBoard
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </div>
    );
}
