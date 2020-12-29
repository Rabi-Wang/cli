import { action, observable, computed } from 'mobx'

export interface ITodo {
  id: number,
  name: string,
  desc: string,
  done?: boolean,
}

let id = 0

export class TodoStore {
  @observable
  todos: ITodo[] = []

  @computed
  get doneCount() {
    return this.todos.filter(todo => todo.done).length
  }

  @computed
  get undoneCount() {
    return this.todos.filter(todo => !todo.done).length
  }

  @action
  addNewTodo = () => {
    const i = id++
    const todo = {
      name: 'new task' + i,
      desc: 'new task' + i,
      id: i,
      done: false,
    }
    this.todos = [...this.todos, todo]
    console.log(this.todos)
  }

  @action
  removeById = (id: number) => {
    this.todos = this.todos.filter(todo => todo.id !== id)
  }

  @action
  toggleStatusById = (id: number) => {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        todo.done = !todo.done
      }
      return todo
    })
  }
}

export const STORE_TODO = Symbol('STORE_TODO')
