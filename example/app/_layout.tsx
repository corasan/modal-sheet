import { ModalSheetProvider } from "@corasan/modal-sheet";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ModalSheetProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "black",
              },
            }}
          />
        </ModalSheetProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
