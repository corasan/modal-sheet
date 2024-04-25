import { ModalSheetProvider } from '@corasan/modal-sheet'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider } from 'tamagui'
import appConfig from '../tamagui.config'

export default function Layout() {
  return (
    <TamaguiProvider config={appConfig}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ModalSheetProvider>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: 'white',
                },
                headerTintColor: 'black',
              }}
            />
          </ModalSheetProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </TamaguiProvider>
  )
}
