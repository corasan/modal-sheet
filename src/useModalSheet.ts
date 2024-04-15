import { useCallback, useContext } from "react";
import { Dimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ModalSheetContext } from "./Context";

const HEIGHT = Dimensions.get("window").height;

export function useModalSheet(options?: { minHeight?: number }) {
  // const context = useContext(ModalSheetContext);
  // if (!context) {
  //   throw new Error("useModalSheet must be used within a ModalSheetProvider");
  // }
  const { top } = useSafeAreaInsets();
  const translateY = useSharedValue(HEIGHT - (options?.minHeight ?? 0));
  // const minimumHeight = useSharedValue(HEIGHT);
  // const dismissValue = useDerivedValue(
  //   () => HEIGHT - (minimumHeight.value === HEIGHT ? 0 : minimumHeight.value),
  // );
  // const isAtMinimumHeight = useDerivedValue(
  //   () => translateY.value === dismissValue.value,
  // );
  // const disableSheetStackEffect = useSharedValue(false);
  // const extendedHeight = useSharedValue(HEIGHT);

  const open = useCallback(() => {
    "worklet";
    translateY.value = withSpring(top + 20, { mass: 0.32 });
  }, []);
  // const dismiss = useCallback(() => {
  //   "worklet";
  //   translateY.value = withTiming(dismissValue.value);
  // }, []);

  // const expand = useCallback((height?: number, disableSheetStack?: boolean) => {
  //   "worklet";
  //   if (disableSheetStack !== undefined) {
  //     disableSheetStackEffect.value = disableSheetStack;
  //   }
  //   if (height) {
  //     translateY.value = withSpring(height, { mass: 0.32 });
  //     extendedHeight.value = height;
  //     return;
  //   }
  //   disableSheetStackEffect.value = false;
  //   translateY.value = withSpring(top + 20, { mass: 0.32 });
  // }, []);
  // const minimize = useCallback((height?: number) => {
  //   "worklet";
  //   if (height) {
  //     extendedHeight.value = height;
  //     translateY.value = withTiming(height);
  //     return;
  //   }
  //   translateY.value = withTiming(dismissValue.value);
  // }, []);
  // const setMinimumHeight = useCallback((height: number) => {
  //   minimumHeight.value = height;
  //   translateY.value = HEIGHT - height;
  // }, []);

  return {
    open,
    // expand,
    // minimize,
    // dismiss,
    // setMinimumHeight,
    // isAtMinimumHeight,
    translateY,
  };
}
