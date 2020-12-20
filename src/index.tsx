import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import {
  HashRouter as Router,
} from 'react-router-dom'
import {
  stores,
  StoresContext,
} from './stores'
import App from './App'
import '@themes/index.global.less'

const Website: React.FC = () => {
  return (
    <Provider {...stores}>
      <StoresContext.Provider value={stores}>
        <Router>
          <App />
        </Router>
      </StoresContext.Provider>
    </Provider>
  )
}

render(<Website /> ,document.getElementById('root'))
