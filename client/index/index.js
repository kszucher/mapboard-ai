import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {store} from "../core/EditorFlow";
import {Page} from "../component/Page";
import '../css/Layout.css'

ReactDOM.render(
    <Provider store={store}>
        <Page/>
    </Provider>,
    document.getElementById('app')
);
