import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "../core/EditorFlow";
import {Page} from "../component/Page";
import '../css/Layout.css';
import '../component-side-css/BreadcrumbMaps.css'
import '../component-side-css/Formatter.css'
import '../component-side-css/FrameCarousel.css'
import '../component-side-css/Logo.css'
import '../component-side-css/Profile.css'
import '../component-side-css/ProfileMenu.css'
import '../component-side-css/SideBarLeft.css'
import '../component-side-css/SideBarRight.css'
import '../component-side-css/TabMaps.css'
import '../component-side-css/UndoRedo.css'


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
