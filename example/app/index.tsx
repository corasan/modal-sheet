import { ModalSheet } from "@corasan/modal-sheet";
import { useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const modal1 = useRef();
  const modal2 = useRef();
  const modal3 = useRef();

  return (
    <View style={styles.container}>
      <Button
        title="Open Modal 1"
        onPress={() => {
          modal1.current?.show();
        }}
      />
      <ModalSheet
        modalId="modal1"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal1}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Modal 1</Text>
          </View>
          <Button
            title="Close Modal"
            onPress={() => {
              modal1.current?.hide();
            }}
          />
          <Button
            title="Open Modal 2"
            onPress={() => {
              modal2.current?.show();
            }}
          />
        </View>
      </ModalSheet>

      <ModalSheet
        modalId="modal2"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal2}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Modal 2</Text>
          </View>
          <Button
            title="Close Modal"
            onPress={() => {
              modal2.current?.hide();
            }}
          />
          <Button
            title="Open Modal 3"
            onPress={() => {
              modal3.current?.show();
            }}
          />
        </View>
      </ModalSheet>
      <ModalSheet
        modalId="modal3"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal3}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Modal 3</Text>
          </View>
          <Button
            title="Close Modal"
            onPress={() => {
              modal3.current?.hide();
            }}
          />
        </View>
      </ModalSheet>
    </View>
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
