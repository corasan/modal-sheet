import { Portal } from "@gorhom/portal";
import { PropsWithChildren } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useModalSheet } from "./ModalSheetProvider";

const HEIGHT = Dimensions.get("window").height;

export const ModalSheet = (props: PropsWithChildren) => {
  const { translateY } = useModalSheet();
  const gesture = Gesture.Pan().onUpdate((e) => {
    translateY.value = e.absoluteY;
  });
  // .onEnd((e) => {
  //   if (e.absoluteY > HEIGHT - 100) {
  //     translateY.value = withTiming(HEIGHT - 100);
  //   } else {
  //     translateY.value = withTiming(150);
  //   }
  // });

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Portal hostName="modalSheet">
      <Animated.View style={[styles.container, modalStyle]}>
        <GestureDetector gesture={gesture}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>
        <View style={{ flex: 1, paddingTop: 0 }}>{props.children}</View>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: "100%",
    backgroundColor: "white",
    bottom: 0,
    zIndex: 9999,
    borderRadius: 30,
    overflow: "hidden",
  },
  handleContainer: {
    height: 30,
    width: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    backgroundColor: "rgba(0,0,0,0.1)",
    height: 5,
    width: "15%",
    borderRadius: 100,
  },
});
