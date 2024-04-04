import { Portal } from "@gorhom/portal";
import { PropsWithChildren } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useModalSheet } from "./ModalSheetProvider";

const HEIGHT = Dimensions.get("window").height;

export interface ModalSheetProps {
  containerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  noHandle?: boolean;
}

export const ModalSheet = ({
  noHandle = false,
  ...props
}: PropsWithChildren<ModalSheetProps>) => {
  const { translateY } = useModalSheet();
  const { top } = useSafeAreaInsets();

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = e.absoluteY;
    })
    .onEnd((e) => {
      console.log("end", e.absoluteY);
      if (e.absoluteY > 220) {
        translateY.value = withTiming(HEIGHT);
      } else {
        translateY.value = withTiming(top + 20);
      }
    });

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Portal hostName="modalSheet">
      <Animated.View
        style={[
          styles.container,
          props.containerStyle,
          styles.permanentContainer,
          modalStyle,
        ]}
      >
        <GestureDetector gesture={gesture}>
          <View style={styles.handleContainer}>
            {!noHandle && <View style={styles.handle} />}
          </View>
        </GestureDetector>
        <View style={{ flex: 1 }}>{props.children}</View>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  permanentContainer: {
    height: HEIGHT,
    width: "100%",
    zIndex: 9999,
    bottom: 0,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 40,
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
    backgroundColor: "rgba(0,0,0,0.15)",
    height: 5,
    width: "10%",
    borderRadius: 100,
  },
});
