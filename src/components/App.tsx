import { FC } from 'react';
import { Provider } from 'react-redux';
import { appStore } from '../data/store.ts';
import { Auth } from './Auth.tsx';

export const App: FC = () => {
  return (
    <Provider store={appStore}>
      <Auth />
    </Provider>
  );
};
