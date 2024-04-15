import { Portal } from "@gorhom/portal";
import {
  PropsWithChildren,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
} from "react";
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
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ModalSheetContext } from "./Context";

const HEIGHT = Dimensions.get("window").height;

type GestureEvent = GestureStateChangeEvent<PanGestureHandlerEventPayload>;

export interface ModalSheetProps {
  containerStyle?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  noHandle?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  minimumHeight?: number;
  disableSheetStackEffect?: boolean;
  onGestureUpdate?: (
    e: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onGestureBegin?: (e: GestureEvent) => void;
  onGestureStarts?: (e: GestureEvent) => void;
  onGestureEnd?: (e: GestureEvent) => void;
  onGestureFinalize?: (e: GestureEvent) => void;
  onGestureTouchesDown?: (e: GestureTouchEvent) => void;
  onGestureTouchesUp?: (e: GestureTouchEvent) => void;
  onGestureTouchesMove?: (e: GestureTouchEvent) => void;
  onGestureTouchesCancelled?: (e: GestureTouchEvent) => void;
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

function interpolateClamp(
  value: number,
  inputRange: number[],
  outputRange: number[],
) {
  "worklet";
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP);
}

export const ModalSheet = forwardRef(
  (
    {
      noHandle = false,
      backdropColor,
      backdropOpacity,
      minimumHeight,
      ...props
    }: PropsWithChildren<ModalSheetProps>,
    ref: any,
  ) => {
    const id = useId();
    const modalId = `modalSheet-${id}`;
    const {
      registerModal,
      addModalToStack,
      removeModalFromStack,
      activeIndex,
      modalStack,
      updateY,
    } = useContext(ModalSheetContext);
    const translateY = useSharedValue(HEIGHT);
    const scaleX = useSharedValue(1);
    const borderRadius = useSharedValue(40);
    const { top } = useSafeAreaInsets();
    const gesture = Gesture.Pan()
      .onBegin((e) => props.onGestureBegin?.(e))
      .onStart((e) => props.onGestureStarts?.(e))
      .onFinalize((e) => props.onGestureFinalize?.(e))
      .onTouchesDown((e) => props.onGestureTouchesDown?.(e))
      .onTouchesUp((e) => props.onGestureTouchesUp?.(e))
      .onTouchesMove((e) => props.onGestureTouchesMove?.(e))
      .onTouchesCancelled((e) => props.onGestureTouchesCancelled?.(e))
      .onUpdate((e) => {
        if (props.onGestureUpdate) {
          props.onGestureUpdate(e);
          return;
        }
        if (e.absoluteY < top) {
          return;
        }
        translateY.value = e.absoluteY;
        const behindModalRef = modalStack[activeIndex.value - 1];
        if (behindModalRef) {
          const val = interpolate(
            e.absoluteY,
            [HEIGHT, top + 20],
            [top + 20, top - 20],
            Extrapolation.CLAMP,
          );
          behindModalRef.translateY.value = val;
        }
      })
      .onEnd((e) => {
        if (props.onGestureEnd) {
          props.onGestureEnd(e);
          return;
        }
        if (e.translationY < 0) {
          // open();
        } else {
          // dismiss();
        }
      });
    const modalStyle = useAnimatedStyle(() => {
      return {
        borderRadius: borderRadius.value,
        transform: [
          {
            translateY: translateY.value,
          },
          {
            scaleX: scaleX.value,
          },
        ],
        // ...(isAtMinimumHeight.value && {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      };
    });
    const backdropStyles = useAnimatedStyle(() => {
      return {
        opacity: interpolateClamp(scaleX.value, [1, 0.95], [0, 0.4]),
        zIndex: interpolateClamp(scaleX.value, [1, 0.95], [0, 999]),
      };
    });

    const show = () => {
      translateY.value = withTiming(top + 15);
      if (activeIndex.value === 0) {
        updateY(withTiming(top + 15));
      }
      addModalToStack(modalId);
      // Animate the modal behind
      const behindModalRef = modalStack[activeIndex.value];
      if (behindModalRef) {
        behindModalRef.translateY.value = withTiming(top - 5);
        behindModalRef.scaleX.value = withTiming(0.95);
        behindModalRef.borderRadius.value = withTiming(24);
      }
    };
    const hide = () => {
      translateY.value = withTiming(HEIGHT - (minimumHeight ?? 0));
      if (activeIndex.value === 1) {
        updateY(withTiming(HEIGHT - (minimumHeight ?? 0)));
      }
      // Animate the modal behind
      const behindModalRef = modalStack[activeIndex.value - 1];
      if (behindModalRef) {
        behindModalRef.translateY.value = withTiming(top + 20);
        behindModalRef.scaleX.value = withTiming(1);
        behindModalRef.borderRadius.value = withTiming(40);
      }
      removeModalFromStack(modalId);
    };
    useImperativeHandle(ref, () => ({
      show,
      hide,
      translateY,
      scaleX,
      borderRadius,
      id: modalId,
    }));

    useEffect(() => {
      registerModal(modalId, ref.current);
    }, [modalId, ref]);

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
          <Animated.View style={[styles.backdrop, backdropStyles]} />
          <GestureDetector gesture={gesture}>
            <View style={styles.handleContainer}>
              {!noHandle && <View style={styles.handle} />}
            </View>
          </GestureDetector>
          <View style={{ flex: 1 }}>{props.children}</View>
        </Animated.View>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  permanentContainer: {
    height: HEIGHT,
    width: "100%",
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: "black",
  },
});
