import React from 'react'
import { observer } from 'mobx-react'
import { Space, Button } from 'antd'
import { useTodoStore } from '@stores'
import Todo from './todo'

const TodoList = () => {
  const {
    todos,
    undoneCount,
    doneCount,
    addNewTodo,
    removeById,
    toggleStatusById,
  } = useTodoStore()
  console.log(useTodoStore())

  return (
    <div>
      <div>
        {`Done: ${doneCount} `}
        {`Undone: ${undoneCount}`}
      </div>
      <Space />
      {
        todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            onRemove={removeById}
            switchStatus={toggleStatusById}
          />
        ))
      }
      <Space />
      <Button onClick={addNewTodo}>Add New</Button>
    </div>
  )
}

export default observer(TodoList)
