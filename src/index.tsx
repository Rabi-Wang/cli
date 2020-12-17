import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import {
  HashRouter as Router,
  Switch,
} from 'react-router-dom'
import {
  routes,
  RouteWithSubRoutes,
} from '@routes'
import {
  stores,
  StoresContext,
} from './stores'
import TodoList from '@components/todoList'
import './index.less'

const App: React.FC = () => {
  console.log(routes)
  return (
    <Router>
      <Switch>
        <Provider {...stores}>
          <StoresContext.Provider value={stores}>
            {
              routes.map((route, index) => (
                <RouteWithSubRoutes key={index} {...route} />
              ))
            }
          </StoresContext.Provider>
        </Provider>
      </Switch>
    </Router>
  )
}

render(<App /> ,document.getElementById('root'))
