import React from 'react';
import ReactDOM from 'react-dom';
import {Layout} from "./Layout";
import {mindBoardApi} from "./MindBoardApi";
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom'
import SignUp from "./ReactMaterialSignUp";
import SignIn from "./ReactMaterialSignIn";

function RouteThis() {
    return(
        <Router>
            <div>
                <Route exact path="/home" component={Layout}/>
                <Route path="/signup" component={SignUp}/>
                {/*<Route path="/contact" component={SignIn} />*/}
            </div>
        </Router>
    );
}


ReactDOM.render(
    <RouteThis>
    </RouteThis>,
    document.getElementById('app')
);
