import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {store} from "../core/EditorFlow";
import {Page} from "../component/Page";
import {Communication} from "../component/Communication";

ReactDOM.render(
    <Provider store={store}>
        {/*<Communication/>*/}
        <Page/>
    </Provider>,
    document.getElementById('app')
);
