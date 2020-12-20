import React from 'react';
import ReactDOM from 'react-dom';
import {Page} from "../components/Page";
import Store from "./Store";
import {Communication} from "../components/Communication";

ReactDOM.render(
    <Store>
        <Communication/>
        <Page/>
    </Store>,
    document.getElementById('app')
);
