import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorReducer";
import {Page} from "./component/Page";
import './Layout.css';
import './input.css';
import { Auth0Provider } from '@auth0/auth0-react'

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <Auth0Provider
    domain="dev-gvarh14b.us.auth0.com"
    clientId="UVB3zZg4PaUXQKAsgoGOMiMwkr0xlcDV"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-gvarh14b.us.auth0.com/api/v2/",
      scope: "read:current_user update:current_user_metadata"
    }}
  >
    <Provider store={store}>
      {/*<React.StrictMode>*/}
      <Page />
      {/*</React.StrictMode>,*/}
    </Provider>
  </Auth0Provider>
)
