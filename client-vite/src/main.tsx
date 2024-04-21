import './index.css'
import ReactDOM from 'react-dom/client'
import {Provider} from "react-redux"
import {store} from "./reducers/EditorReducer"
import {App} from "./components/app/App"
import './RotatingText.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@radix-ui/themes/styles.css'
import './theme-config.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path="docs" element={<div />}/>
      </Routes>
    </BrowserRouter>
  </Provider>
)
