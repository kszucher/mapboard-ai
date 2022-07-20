import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorFlow";
import {Page} from "./component/unsorted/Page";
import './component-css/Layout.css';
import './component-css/modal/CreateTable.css'
import './component-css/modal/Settings.css'
import './component-css/modal/Shares.css'
import './component-css/modal/ShareThisMap.css'
import './component-css/modal/CreateMapInMap.css'
import './component-css/modal/UpdateTask.css'
import './component-css/side/BreadcrumbMaps.css'
import './component-css/side/Formatter.css'
import './component-css/side/FrameCarousel.css'
import './component-css/side/Logo.css'
import './component-css/side/Profile.css'
import './component-css/side/ProfileMenu.css'
import './component-css/side/ControlsLeft.css'
import './component-css/side/ControlsRight.css'
import './component-css/side/TabMaps.css'
import './component-css/side/UndoRedo.css'
import './component-css/unsorted/Auth.css'
import './component-css/unsorted/Icons.css'
import './component-css/unsorted/Page.css'


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
