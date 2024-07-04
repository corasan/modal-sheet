import 'expo-dev-client'
import { ModalSheetProvider } from '@corasan/modal-sheet'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TamaguiProvider } from 'tamagui'
import appConfig from '../tamagui.config'
import { PortalProvider } from '@gorhom/portal'

export default function Layout() {
  return (
    <TamaguiProvider config={appConfig}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PortalProvider>
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
          </PortalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </TamaguiProvider>
  )
}
