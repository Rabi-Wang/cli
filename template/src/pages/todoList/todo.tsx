import React from 'react'
import { Button } from 'antd'
import { ITodo } from '@stores/todo'

type IProps = {
  todo: ITodo,
  onRemove: (id: number) => void,
  switchStatus: (id: number) => void
}

const Todo: React.FC<IProps> = (props) => {
  const {
    todo,
    onRemove,
    switchStatus
  } = props

  return (
    <div>
      <div title={todo.desc}>{todo.name}</div>
      <div>
        <Button onClick={() => switchStatus(todo.id)}>{todo.done ? 'Done' : 'Undone'}</Button>
        <Button onClick={() => onRemove(todo.id)}>Delete</Button>
      </div>
    </div>
  )
}

export default Todo
