import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorFlow";
import {Page} from "./component/Page";
import './Layout.css';
import './input.css';
import './component/side/TabMaps.css'
import './component/side/UndoRedo.css'
import './component/Auth.css'

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
