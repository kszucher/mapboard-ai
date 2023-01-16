import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Button, Link, TextField, Typography } from '@mui/material'
import {actions} from "../core/EditorFlow";
import {FC} from "react";
import {AuthPageState, PageState} from "../core/Types";
import {initDomData} from "../core/DomFlow";
import {api} from "../core/Api";

export const Auth: FC = () => {
  const authPageState = useSelector((state: RootStateOrAny) => state.editor.authPageState)
  const name = useSelector((state: RootStateOrAny) => state.editor.name)
  const email = useSelector((state: RootStateOrAny) => state.editor.email)
  const password = useSelector((state: RootStateOrAny) => state.editor.password)
  const passwordAgain = useSelector((state: RootStateOrAny) => state.editor.passwordAgain)
  const confirmationCode = useSelector((state: RootStateOrAny) => state.editor.confirmationCode)
  const authFeedbackMessage = useSelector((state: RootStateOrAny) => state.editor.authFeedbackMessage)

  const dispatch = useDispatch()
  return (
    <div className="_bg relative left-1/2 -translate-x-1/2 top-[96px] w-[384px] flex flex-col items-center inline-flex gap-4 p-5 rounded-2xl">
      <Typography color="primary" component="h1" variant="h5">
        {'MapBoard'}
      </Typography>
      <Typography color="primary" component="h1" variant="h6">
        {'Private Beta'}
      </Typography>
      {
        [AuthPageState.SIGN_UP_STEP_1, AuthPageState.SIGN_UP_STEP_2].includes(authPageState) &&
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <Button
            id="step-1" color="primary"
            variant={authPageState === AuthPageState.SIGN_UP_STEP_1 ? 'contained' : 'outlined'}
            onClick={_=>dispatch(actions.signUpStep1Panel())}>
            {'STEP 1'}
          </Button>
          <Button
            id="step2" color="primary"
            variant={authPageState === AuthPageState.SIGN_UP_STEP_2 ? 'contained' : 'outlined'}
            onClick={_=>dispatch(actions.signUpStep2Panel())}>
            {'STEP 2'}
          </Button>
        </div>
      }
      {
        authPageState === AuthPageState.SIGN_UP_STEP_1 &&
        <TextField
          id="your-first-name" variant="outlined" fullWidth label="Your First Name" autoFocus
          value={name}
          onChange={({target: {value}}) => dispatch(actions.setName(value))}/>
      }
      {
        [AuthPageState.SIGN_IN, AuthPageState.SIGN_UP_STEP_1, AuthPageState.SIGN_UP_STEP_2].includes(authPageState) &&
        <TextField
          id="email" variant="outlined" fullWidth label="Email"
          value={email}
          onChange={({target: {value}}) => dispatch(actions.setEmail(value))}/>
      }
      {
        [AuthPageState.SIGN_IN, AuthPageState.SIGN_UP_STEP_1].includes(authPageState) &&
        <TextField
          id="password" variant="outlined" fullWidth label="Password" type="password"
          value={password}
          onChange={({target: {value}}) => dispatch(actions.setPassword(value))}/>
      }
      {
        authPageState === AuthPageState.SIGN_UP_STEP_1 &&
        <TextField
          id="password-again" variant="outlined" fullWidth label="Password Again" type="password"
          value={passwordAgain}
          onChange={({target: {value}}) => dispatch(actions.setPasswordAgain(value))}/>
      }
      {
        authPageState === AuthPageState.SIGN_UP_STEP_2 &&
        <TextField
          id="confirmation-code" variant="outlined" fullWidth label="Confirmation Code" autoFocus
          value={confirmationCode}
          // onChange={({target: {value}}) => dispatch(sagaActions.checkSetConfirmationCode(value))}/>
      }
      {
        authPageState === AuthPageState.SIGN_UP_STEP_1 &&
        <Button
          id="get-confirmation-code" color="primary" variant='contained' fullWidth
          disabled={name === '' || email === '' || password === '' || passwordAgain === '' || password !== passwordAgain}
          // onClick={_=>dispatch(sagaActions.signUpStep1(name, email, password))}>
          {'Get Confirmation Code'}
        </Button>
      }
      {
        authPageState === AuthPageState.SIGN_UP_STEP_2 &&
        <Button
          id="enter-confirmation-code" color="primary" variant='contained' fullWidth
          disabled={email === '' || confirmationCode === '' || confirmationCode.length !== 4}
          // onClick={_=>dispatch(sagaActions.signUpStep2(email, confirmationCode))}>
          {'Enter Confirmation Code'}
        </Button>
      }
      {
        authPageState === AuthPageState.SIGN_IN &&
        <Button
          id="sign-in" color="primary" variant='contained' fullWidth
          disabled={false}
          onClick={
            () => {
              localStorage.setItem('cred', JSON.stringify({email, password}))
              dispatch(api.endpoints.signIn.initiate())
            }
          }>
          {'SIGN IN'}
        </Button>
      }
      {
        authFeedbackMessage !== '' &&
        <Typography
          id="auth-feedback-message" variant="body2" color="textSecondary" align="center">
          {authFeedbackMessage}
        </Typography>
      }
      {
        [AuthPageState.SIGN_UP_STEP_1, AuthPageState.SIGN_UP_STEP_2].includes(authPageState) &&
        <Button
          id="sign-in-instead" fullWidth color="primary" variant="outlined"
          onClick={_=>dispatch(actions.signInPanel())}>
          {'SIGN IN INSTEAD'}
        </Button>
      }
      {
        authPageState === AuthPageState.SIGN_IN &&
        <Button
          id="sign-up-instead" fullWidth color="primary" variant="outlined"
          onClick={_=>dispatch(actions.signUpPanel())}>
          {'SIGN UP INSTEAD'}
        </Button>}
      <Button
        id="live-demo" color="primary" variant='contained' fullWidth
        onClick={
          ()=> {
            initDomData()
            dispatch(actions.setPageState(PageState.DEMO))
          }
        }>
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
