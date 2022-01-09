import Taro from '@tarojs/taro'
import { Component } from 'react'
import { Provider } from 'react-redux'
import zoro from '@opcjs/zoro'
import { createLoading } from '@opcjs/zoro-plugin'
import { models } from '@/models'
import mixins from '@/mixins'

import './app.global.scss'

const app = zoro({
  onError(error) {
    if (error.message) {
      Taro.showToast({
        icon: 'none',
        title: error.message,
      })
    }
  },
})
app.use(mixins)
app.use(createLoading())
app.model(models)

const store = app.start(false)

if (CONFIG.DEBUG) {
  store.subscribe(() => console.log(store.getState()))
}

class App extends Component {
  componentDidMount() {
    app.setup()
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}

export default App
