import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux"
import {store} from "./reducers/EditorReducer"
import {Page} from "./components/misc/Page"
import './Layout.css'
import './RotatingText.css'
import './input.css'
import { Docs } from './components/docs/Docs'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@radix-ui/themes/styles.css'
import './theme-config.css';


const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />}/>
        <Route path="docs" element={<Docs />}/>
      </Routes>
    </BrowserRouter>
  </Provider>
)
