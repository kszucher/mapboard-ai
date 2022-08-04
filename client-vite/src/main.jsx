import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {Provider} from "react-redux";
import {store} from "./core/EditorFlow";
import {Page} from "./component/Page";
import './Layout.css';
import './component/modal/CreateTable.css'
import './component/modal/Profile.css'
import './component/modal/Settings.css'
import './component/modal/Shares.css'
import './component/modal/ShareThisMap.css'
import './component/modal/ShouldCreateMapInMap.css'
import './component/modal/ShouldDeleteUser.css'
import './component/modal/ShouldUpdateTask.css'
import './component/side/BreadcrumbMaps.css'
import './component/side/Formatter.css'
import './component/side/FrameCarousel.css'
import './component/side/Logo.css'
import './component/side/ProfileButton.css'
import './component/side/ProfileMenu.css'
import './component/side/ControlsLeft.css'
import './component/side/ControlsRight.css'
import './component/side/TabMaps.css'
import './component/side/UndoRedo.css'
import './component/Auth.css'
import './component/Icons.css'
import './component/Page.css'


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Page />
        </React.StrictMode>,
    </Provider>,
    document.getElementById('root')
)
