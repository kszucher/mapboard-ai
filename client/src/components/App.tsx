import { Auth0Provider } from '@auth0/auth0-react';
import { FC } from 'react';
import { Provider } from 'react-redux';
import { appStore } from '../data/store.ts';
import { Router } from './Router.tsx';

export const App: FC = () => {
  return (
    <Provider store={appStore}>
      <Auth0Provider
        domain="mapboard.eu.auth0.com"
        clientId="tUtOWoIYJQzJqh4jr1pwGOCmRzK2SFZH"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: 'https://mapboard.eu.auth0.com/api/v2/',
          scope: 'read:current_user update:current_user_metadata',
        }}
      >
        <Router />
      </Auth0Provider>
    </Provider>
  );
};
