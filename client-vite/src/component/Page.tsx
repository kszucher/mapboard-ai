import {Auth0Provider} from "@auth0/auth0-react"
import React, {FC, useEffect} from 'react'
import {Provider, useSelector} from "react-redux"
import {RootState, store} from "../core/EditorReducer"
import {Landing} from "./Landing"
import {PageState} from "../state/Enums"
import {getEquationDim, getTextDim} from "./MapDivUtils"
import {Editor} from "./Editor"

export const Page: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
  }, [])

  return (
    <Auth0Provider
      domain="dev-gvarh14b.us.auth0.com"
      clientId="UVB3zZg4PaUXQKAsgoGOMiMwkr0xlcDV"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-gvarh14b.us.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata"
      }}
    >
      {pageState === PageState.AUTH && <Landing/>}
      {pageState!== PageState.AUTH && <Editor/>}
    </Auth0Provider>
  )
}
