import React from 'react';
import { useSelector } from 'react-redux';
import { PageState } from '../data/state-types.ts';
import { RootState } from '../data/store.ts';
import { Editor } from './Editor.tsx';
import { Landing } from './Landing.tsx';

export const Router = () => {
  const pageState = useSelector((state: RootState) => state.slice.pageState);
  return (
    <React.Fragment>
      {pageState === PageState.AUTH && <Landing />}
      {pageState === PageState.WS && <Editor />}
    </React.Fragment>
  );
};
