import { Portal } from "@gorhom/portal";
import { PropsWithChildren, useContext, useEffect } from "react";
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
  GestureUpdateEvent,
  GestureTouchEvent,
} from "react-native-gesture-handler";
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ModalSheetContext } from "./ModalSheetProvider";

const HEIGHT = Dimensions.get("window").height;

type GestureEvent = GestureStateChangeEvent<PanGestureHandlerEventPayload>;

export interface ModalSheetProps {
  containerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  noHandle?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  minimumHeight?: number;
  disableSheetStackEffect?: boolean;
  onGestureUpdate?: (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onGestureBegin?: (e: GestureEvent) => void;
  onGestureEnd?: (e: GestureEvent) => void;
  onGestureStarts?: (e: GestureEvent) => void;
  onTouchesDown?: (e: GestureTouchEvent) => void;
  onTouchesUp?: (e: GestureTouchEvent) => void;
  onTouchesMove?: (e: GestureTouchEvent) => void;
  onTouchesCancelled?: (e: GestureTouchEvent) => void;
  onFinalize?: (e: GestureEvent) => void;
}

export const useModalSheet = () => {
  const context = useContext(ModalSheetContext);
  if (context === undefined) {
    throw new Error("useModalSheet must be used within a ModalSheetProvider");
  }
  return {
    open: context.open,
    dismiss: context.dismiss,
    expand: context.expand,
    minimize: context.minimize,
    translateY: context.translateY,
  };
};

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
  backdropColor,
  backdropOpacity,
  minimumHeight,
  ...props
}: PropsWithChildren<ModalSheetProps>) => {
  const {
    translateY,
    dismiss,
    open,
    backdropOpacity: bckdropOpacity,
    backdropColor: bckdropColor,
    setMinimumHeight,
    isAtMinimumHeight,
    disableSheetStackEffect,
  } = useInternalModalSheet();
  const { top } = useSafeAreaInsets();
  const gesture = Gesture.Pan()
    .onBegin((e) => props.onGestureBegin?.(e))
    .onStart((e) => props.onGestureStarts?.(e))
    .onTouchesDown((e) => props.onTouchesDown?.(e))
    .onTouchesUp((e) => props.onTouchesUp?.(e))
    .onTouchesMove((e) => props.onTouchesMove?.(e))
    .onTouchesCancelled((e) => props.onTouchesCancelled?.(e))
    .onFinalize((e) => props.onFinalize?.(e))
    .onUpdate((e) => {
      if (props.onGestureUpdate) {
        props.onGestureUpdate(e);
        return;
      }
      if (e.absoluteY < top) {
        return;
      }
      translateY.value = e.absoluteY;
    })
    .onEnd((e) => {
      if (props.onGestureEnd) {
        props.onGestureEnd(e);
        return;
      }
      if (e.translationY < 0) {
        open();
      } else {
        dismiss();
      }
    });
  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    ...(isAtMinimumHeight.value && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }),
  }));

  useEffect(() => {
    disableSheetStackEffect.value = !!props.disableSheetStackEffect;
    if (backdropColor && backdropColor !== "black") {
      bckdropColor.value = backdropColor;
    }
    if (backdropOpacity && backdropOpacity !== 0.4) {
      bckdropOpacity.value = backdropOpacity;
    }
    if (minimumHeight) {
      setMinimumHeight(minimumHeight);
    }
  }, [
    backdropOpacity,
    backdropOpacity,
    minimumHeight,
    props.disableSheetStackEffect,
  ]);

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
  },
  container: {
    backgroundColor: "white",
    borderRadius: 40,
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
