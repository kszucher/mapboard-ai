import './index.css'
import ReactDOM from 'react-dom/client'
import {Provider} from "react-redux"
import {store} from "./reducers/EditorReducer.ts"
import {App} from "./components/app/App"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@radix-ui/themes/styles.css'

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
