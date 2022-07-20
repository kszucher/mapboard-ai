import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorFlow";
import {Page} from "../components/unsorted/Page";
import './css/Layout.css';
import '../components/side-css/BreadcrumbMaps.css'
import '../components/side-css/Formatter.css'
import '../components/side-css/FrameCarousel.css'
import '../components/side-css/Logo.css'
import '../components/side-css/Profile.css'
import '../components/side-css/ProfileMenu.css'
import '../components/side-css/SideBarLeft.css'
import '../components/side-css/SideBarRight.css'
import '../components/side-css/TabMaps.css'
import '../components/side-css/UndoRedo.css'


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
