import React from 'react'
import { createRoot } from 'react-dom/client';
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorFlow";
import {Page} from "./component/Page";
import './Layout.css';
import './input.css';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
    <Provider store={store}>
      <React.StrictMode>
        <Page />
      </React.StrictMode>,
    </Provider>
)
