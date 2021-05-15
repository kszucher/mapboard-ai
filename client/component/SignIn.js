import React, {useContext, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Context} from "../core/Store";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
}));

export default function SignIn() {
    const classes = useStyles();

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
            <CssBaseline />
            <div className={classes.paper} >
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    MindBoard Private Beta
                </Typography>
                    <TextField variant="outlined" margin="normal" fullWidth id="email" label="Email Address" autoComplete="email" autoFocus onChange={typeEmail}/>
                    <TextField variant="outlined" margin="normal" fullWidth  id="password" label="Password" type="password" autoComplete="current-password" onChange={typePassword}/>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={signInHandler}
                    >
                        Sign In
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={signInHandler}
                    >
                        Sign Up With Invitation
                    </Button>
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
