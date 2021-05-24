import React, {useContext, useState} from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {Context} from "../core/Store";
import StyledInput from "../component-styled/StyledInput";
import StyledButtonGroup from "../component-styled/StyledButtonGroup";

export default function Auth() {
    const [tabValue, setTabValue] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [state, dispatch] = useContext(Context);

    const typeName = (e) =>             setName(e.target.value)
    const typeEmail = (e) =>            setEmail(e.target.value)
    const typePassword = (e) =>         setPassword(e.target.value)
    const typePasswordAgain = (e) =>    setPasswordAgain(e.target.value)

    const switchMode = () => {
        setTabValue(!tabValue&1);
        setName('');
        setEmail('')
        setPassword('');
        setPasswordAgain('');
    }

    const signInHandler = () =>    {
        if (password.length > 5) {
            dispatch({type: 'SIGN_IN', payload: {email, password}})
        }
    }
    const signUpHandler = () => {
        if (password.length > 5 && password === passwordAgain) {
            dispatch({type: 'SIGN_UP', payload: {name, email, password}})
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
            <Typography component="h1" variant="h5">
                MindBoard
            </Typography>
            <Typography component="h1" variant="h6">
                Private Beta
            </Typography>
            <StyledButtonGroup
                action={switchMode}
                value={['Sign In', 'Sign Up'][tabValue]}
                valueList={['Sign In', 'Sign Up']}
            />
            {tabValue===1 &&    <StyledInput value={name}           label="Your First Name" type=""         onChange={typeName} autoFocus={true}/>}
            {                   <StyledInput value={email}          label="Email"           type=""         onChange={typeEmail}/>}
            {                   <StyledInput value={password}       label="Password"        type="password" onChange={typePassword}/>}
            {tabValue===1 &&    <StyledInput value={passwordAgain}  label="Password Again"  type="password" onChange={typePasswordAgain}/>}
            {/*TODO confirmation page*/}
            <Button
                variant="contained"
                fullWidth
                type="submit"
                color="primary"
                onClick={tabValue?signUpHandler:signInHandler}>
                {['Sign In', 'Sign Up'][tabValue]}
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
