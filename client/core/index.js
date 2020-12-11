import React from 'react';
import ReactDOM from 'react-dom';
import {Page} from "../components/Page";
import Store from "./Store";

ReactDOM.render(
    <Store>
        <Page/>
    </Store>,
    document.getElementById('app')
);
