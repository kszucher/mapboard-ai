// import './index.css'
import ReactDOM from 'react-dom/client'
// import {Provider} from "react-redux"
// import {store} from "./reducers/EditorReducer"
// import {App} from "./components/app/App"
// import './Layout.css'
// import './RotatingText.css'
// import './input.css'
// import { Docs } from './components/docs/Docs'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import '@radix-ui/themes/styles.css'
// import './theme-config.css'
// import './index.css'
// import './Layout.css'
// import './RotatingText.css'
// import './input.css'
// import './theme-config.css'
import './index.css'
import {Provider} from "react-redux"
import {store} from "./reducers/EditorReducer"
import {App} from "./components/app/App"
import './Layout.css'
import './RotatingText.css'
import './input.css'
import { Docs } from './components/docs/Docs'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@radix-ui/themes/styles.css'
import './theme-config.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path="docs" element={<Docs />}/>
      </Routes>
    </BrowserRouter>
  </Provider>
)
