import {Auth0Provider} from "@auth0/auth0-react"
import {useSelector} from "react-redux"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {PageState} from "../consts/Enums.ts"
import {Editor} from "../editorComponents/Editor.tsx"
import {Landing} from "../landingComponents/Landing.tsx"
import {RootState} from "../rootComponent/RootComponent.tsx"

export const RootAuthComponent = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
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
            {pageState === PageState.WS && <Editor/>}
          </Auth0Provider>
        }/>
        <Route path="docs" element={<div/>}/>
      </Routes>
    </BrowserRouter>
  )
}
