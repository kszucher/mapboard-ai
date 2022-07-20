import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorFlow";
import {Page} from "../components/unsorted/Page";
import './css/Layout.css';
import '../components-css/side/BreadcrumbMaps.css'
import '../components-css/side/Formatter.css'
import '../components-css/side/FrameCarousel.css'
import '../components-css/side/Logo.css'
import '../components-css/side/Profile.css'
import '../components-css/side/ProfileMenu.css'
import '../components-css/side/SideBarLeft.css'
import '../components-css/side/SideBarRight.css'
import '../components-css/side/TabMaps.css'
import '../components-css/side/UndoRedo.css'


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
