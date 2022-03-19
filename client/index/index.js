import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {store} from "../../client-vite/core/EditorFlow";
import {Page} from "../../client-vite/component/Page";
import '../../client-vite/css/Layout.css'

ReactDOM.render(
    <Provider store={store}>
        <Page/>
    </Provider>,
    document.getElementById('app')
);
