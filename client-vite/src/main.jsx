import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "../core/EditorFlow";
import {Page} from "../component/Page";
import '../../client-vite/css/Layout.css'

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
