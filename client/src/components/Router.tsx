import { useSelector } from 'react-redux';
import { PageState } from '../data/clientSide/EditorStateTypes.ts';
import { RootState } from '../data/store.ts';
import { Editor } from './Editor.tsx';
import { Landing } from './Landing.tsx';
import React from 'react';

export const Router = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState);
  return (
    <React.Fragment>
      {pageState === PageState.AUTH && <Landing />}
      {pageState === PageState.WS && <Editor />}
    </React.Fragment>
  );
};
