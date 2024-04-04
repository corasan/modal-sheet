import {
  ModalSheetProvider,
  ModalSheet,
  useModalSheet,
} from "@corasan/modal-sheet";
import { Button, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Modal = () => {
  const { open, dismiss } = useModalSheet();
  return (
    <View style={styles.container}>
      <Button
        title="Open Modal"
        onPress={() => {
          console.log("PRESSED");
          open();
        }}
      />
      <ModalSheet>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Modal Title</Text>
          </View>

          <View
            style={{
              paddingVertical: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              title="Close Modal"
              onPress={() => {
                dismiss();
              }}
            />
          </View>
        </View>
      </ModalSheet>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ModalSheetProvider>
          <View style={styles.container}>
            <Modal />
          </View>
        </ModalSheetProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
