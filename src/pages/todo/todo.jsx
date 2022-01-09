import { useState, useCallback, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, Button, Text, Icon } from '@tarojs/components'
import { useDidMount } from 'beautiful-react-hooks'
import { dispatcher } from '@opcjs/zoro'
import useModel from '@/models'
import { isEmpty } from '@/utils/type'

import Spin from '@/components/spin/spin'

import styles from './todo.scss'

export default function Todo() {
  const { todos, todoLoading } = useModel(({ todo, loading }) => ({
    todos: todo.lists,
    todoLoading:
      loading.effect['todo/getTodos'] ||
      loading.effect['todo/addTodo'] ||
      loading.effect['todo/deleteTodo'] ||
      false,
  }))

  const [text, setText] = useState('')

  useDidMount(() => {
    dispatcher.todo.getTodos()
  })

  const refresh = useCallback(async () => {
    setText('')
    await dispatcher.todo.getTodos()
  }, [])

  const handleInput = useCallback(({ detail: { value } }) => {
    setText(value)
  }, [])

  const handleAdd = useCallback(async () => {
    if (isEmpty(text)) {
      Taro.showToast({
        icon: 'none',
        title: '请输入待办事项！',
      })
      return
    }

    await dispatcher.todo.addTodo({ text })
    refresh()
    Taro.showToast({
      icon: 'none',
      title: '添加成功',
    })
  }, [refresh, text])

  const handleDelete = useCallback(
    async (id) => {
      await dispatcher.todo.deleteTodo({ id })
      refresh()
      Taro.showToast({
        icon: 'none',
        title: '删除成功',
      })
    },
    [refresh],
  )

  const handleHttpStatusError = useCallback(() => {
    dispatcher.todo.httpStatusError()
  }, [])

  const handleServiceError = useCallback(() => {
    dispatcher.todo.serviceError()
  }, [])

  return useMemo(() => {
    return (
      <View className={styles.todo}>
        <Spin loading={todoLoading} />
        <View className={styles.logo} />
        <Input
          className={styles.input}
          value={text}
          placeholder="输入添加的待办事件"
          onInput={handleInput}
        />
        <View className={styles.tools}>
          <Button className={styles.tool} onClick={handleAdd}>
            添加
          </Button>
          <Button className={styles.tool} onClick={handleHttpStatusError}>
            演示http服务错误
          </Button>
          <Button className={styles.tool} onClick={handleServiceError}>
            演示业务错误
          </Button>
        </View>
        {todos.map((todo) => (
          <View className={styles.todo} key={todo.id}>
            <Text>{todo.text}</Text>
            <View onClick={() => handleDelete(todo.id)}>
              <Icon type="cancel" className={styles.delete} />
            </View>
          </View>
        ))}
      </View>
    )
  }, [
    handleAdd,
    handleDelete,
    handleHttpStatusError,
    handleInput,
    handleServiceError,
    todoLoading,
    text,
    todos,
  ])
}
