import React, {useContext, useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Context} from "../core/Store";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, dispatch] = useContext(Context);

    const typeEmail = (e) => {        setEmail(e.target.value);    };
    const typePassword = (e) => {     setPassword(e.target.value);    };
    const signInHandler = () => {     dispatch({type: 'SIGN_IN', payload: {email, password}})};

    return (
        <Container
            component="main"
            maxWidth="xs"
            style={{
                position: 'relative',
                top: 96,
                border: "1px solid #fbfafc",
                borderRadius: '16px',
                padding: 20,
            }}
        >
            <div
                 style={{
                     padding: 20,
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                 }}
            >
                <Typography component="h1" variant="h5">
                    MindBoard Private Beta
                </Typography>
                <TextField  variant="outlined"   fullWidth type="email"     label="Email Address" autoComplete="email"              onChange={typeEmail} autoFocus/>
                <TextField  variant="outlined"   fullWidth type="password"  label="Password"      autoComplete="current-password"   onChange={typePassword}/>
                <Button     variant="contained"  fullWidth type="submit"    color="primary"                                         onClick={signInHandler}>Sign In</Button>
                <Button     variant="outlined"   fullWidth type="submit"    color="primary"                                         onClick={signInHandler}>Sign Up</Button>
            </div>
            <Box mt={8}>
                <Typography variant="body2" color="textSecondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="http://mindboard.io/">
                        MindBoard
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Box>
        </Container>
    );
}
