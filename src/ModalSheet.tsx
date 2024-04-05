import { Portal } from "@gorhom/portal";
import { PropsWithChildren, useContext } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  AnimatedStyle,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ModalSheetContext } from "./ModalSheetProvider";

const HEIGHT = Dimensions.get("window").height;

export interface ModalSheetProps {
  containerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  noHandle?: boolean;
  minimizeHeight?: number;
  onGestureEnd?: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
}

export const useInternalModalSheet = () => {
  const context = useContext(ModalSheetContext);
  if (context === undefined) {
    throw new Error(
      "useInternalModalSheet must be used within a ModalSheetProvider",
    );
  }
  return context;
};

export const ModalSheet = ({
  noHandle = false,
  ...props
}: PropsWithChildren<ModalSheetProps>) => {
  const { translateY, minimize, open } = useInternalModalSheet();

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = e.absoluteY;
    })
    .onEnd((e) => {
      if (props.onGestureEnd) {
        runOnJS(props.onGestureEnd)(e);
        return;
      }
      if (e.translationY < 0) {
        open();
      } else {
        minimize();
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
