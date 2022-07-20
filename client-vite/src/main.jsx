import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorFlow";
import {Page} from "./component/unsorted/Page";
import './component-css/Layout.css';
import './component-css/side/BreadcrumbMaps.css'
import './component-css/side/Formatter.css'
import './component-css/side/FrameCarousel.css'
import './component-css/side/Logo.css'
import './component-css/side/Profile.css'
import './component-css/side/ProfileMenu.css'
import './component-css/side/SideBarLeft.css'
import './component-css/side/SideBarRight.css'
import './component-css/side/TabMaps.css'
import './component-css/side/UndoRedo.css'
import './component-css/unsorted/Auth.css'


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
