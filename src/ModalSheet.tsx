import { Portal } from "@gorhom/portal";
import { PropsWithChildren } from "react";
import { Dimensions, View } from "react-native";
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
      <Animated.View
        style={[
          {
            height: HEIGHT,
            width: "100%",
            backgroundColor: "white",
            bottom: 0,
            zIndex: 9999,
            borderRadius: 30,
            overflow: "hidden",
          },
          modalStyle,
        ]}
      >
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={{
              height: 30,
              width: "100%",
              backgroundColor: "red",
            }}
          />
        </GestureDetector>
        <View style={{ flex: 1, paddingTop: 0 }}>{props.children}</View>
      </Animated.View>
    </Portal>
  );
};
