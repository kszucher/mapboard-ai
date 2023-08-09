import {Auth0Provider} from "@auth0/auth0-react"
import React, {FC, useEffect} from 'react'
import {useSelector} from "react-redux"
import {RootState} from "../core/EditorReducer"
import {Landing} from "./Landing"
import {PageState} from "../state/Enums"
import {MapDivMenu} from "./MapDivMenu";
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
      domain="mapboard.eu.auth0.com"
      clientId="tUtOWoIYJQzJqh4jr1pwGOCmRzK2SFZH"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://mapboard.eu.auth0.com/api/v2/",
        scope: "read:current_user update:current_user_metadata"
      }}
    >
      {pageState === PageState.AUTH && <Landing/>}
      {pageState!== PageState.AUTH && <Editor/>}
      {<MapDivMenu/>}
    </Auth0Provider>
  )
}
