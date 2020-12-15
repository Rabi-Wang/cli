import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import { Button } from 'antd'
import { stores, StoresContext } from './stores'
import TodoList from '@components/todoList'
import './index.less'

const App: React.FC = () => {
  return (
    <Provider {...stores}>
      {console.log(stores)}
      <StoresContext.Provider value={stores}>
        <TodoList />
      </StoresContext.Provider>
    </Provider>
  )
}

render(<App /> ,document.getElementById('root'))
