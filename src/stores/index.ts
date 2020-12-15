import { createContext, useContext } from 'react'
import { useLocalStore } from 'mobx-react'
import { STORE_TODO, TodoStore } from './todo'

function createStores() {
  return {
    [STORE_TODO]: new TodoStore(),
  }
}

const stores = createStores()

const StoresContext = createContext(stores)

const useStores = () => useContext(StoresContext)

function useTodoStore() {
  const { [STORE_TODO]: todoStore } = useStores()
  return todoStore
}

export {
  STORE_TODO,
  TodoStore,
  createStores,
  stores,
  StoresContext,
  useStores,
  useTodoStore,
}
