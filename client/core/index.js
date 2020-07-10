import React                                        from 'react';
import ReactDOM                                     from 'react-dom';
import {Layout}                                     from "./Layout";
import { Route, BrowserRouter as Router }           from 'react-router-dom'

function RouteThis() {
    return(
        <Layout/>
        // <Router>
        //     <div>
        //         <Route exact path="/home" component={Layout}/>
        //     </div>
        // </Router>
    );
}

ReactDOM.render(
    <RouteThis>
    </RouteThis>,
    document.getElementById('app')
);
