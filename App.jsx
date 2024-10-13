import React from 'react'
import AppNavigator from './src/navigation/AppNavigation'
import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <AppNavigator />
      </GestureHandlerRootView>
    </Provider>
  )
}

export default App
