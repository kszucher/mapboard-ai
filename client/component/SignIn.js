import React, {useContext, useState} from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {Context} from "../core/Store";
import StyledTabs from "../component-styled/StyledTabs";
import StyledInput from "../component-styled/StyledInput";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, dispatch] = useContext(Context);
    const typeEmail = (e) => {        setEmail(e.target.value);    };
    const typePassword = (e) => {     setPassword(e.target.value);    };
    const signInHandler = () => {     dispatch({type: 'SIGN_IN', payload: {email, password}})};
    const signUpHandler = () => {     /*TODO*/};
    const signSwitch = () => {};
    return (
        <div
            style={{
                position: 'relative',
                left: '50%',
                transform: 'translate(-50%)',
                top: 96,
                width: 48*10,
                height: 48*10,
                border: "1px solid #fbfafc",
                borderRadius: '16px',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
            <Typography component="h1" variant="h5">
                MindBoard Private Beta
            </Typography>
            <StyledTabs
                valueList={["Sign In", "Sign Up"]}
                value={0}
                onChange={signSwitch}
                orientation={'horizontal'}
                component={'sign'}
            />
            <StyledInput label="Email Address"  type="email"    onChange={typeEmail}    autoFocus={true}/>
            <StyledInput label="Password"       type="password" onChange={typePassword}/>
            <Button     variant="contained"  fullWidth type="submit"    color="primary" onClick={signInHandler}>Sign In</Button>
            <Button     variant="outlined"   fullWidth type="submit"    color="primary" onClick={signUpHandler}>Sign Up</Button>
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
