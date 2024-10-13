import './index.css'
import ReactDOM from 'react-dom/client'
import {Provider} from "react-redux"
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {appStore, RootComponent} from "./rootComponent/RootComponent.tsx"
import '@radix-ui/themes/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={appStore}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootComponent />}/>
        <Route path="docs" element={<div />}/>
      </Routes>
    </BrowserRouter>
  </Provider>
)
