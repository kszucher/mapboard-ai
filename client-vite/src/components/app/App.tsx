import {Auth0Provider} from "@auth0/auth0-react"
import {FC} from 'react'
import {useSelector} from "react-redux"
import {RootState} from "../../reducers/EditorReducer"
import {Landing} from "../landing/Landing"
import {PageState} from "../../state/Enums"
import {Editor} from "../editor/Editor"

export const App: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
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
      {pageState === PageState.WS && <Editor/>}
    </Auth0Provider>
  )
}
