import React from 'react';
import ReactDOM from 'react-dom';
import {Page} from "../component/Page";
import Store from "./Store";
import {Communication} from "../component/Communication";

ReactDOM.render(
    <Store>
        <Communication/>
        <Page/>
    </Store>,
    document.getElementById('app')
);
