import { PortalProvider } from "@gorhom/portal";
import { PropsWithChildren, createContext, useContext, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEIGHT = Dimensions.get("window").height;

export const ModalSheetContext = createContext<{
  translateY: SharedValue<number>;
  modalRef: any | null;
  open: () => void;
  dismiss: () => void;
}>({
  // @ts-ignore
  translateY: 0,
  modalRef: null,
});

export const useModalSheet = () => {
  const context = useContext(ModalSheetContext);
  if (context === undefined) {
    throw new Error("useModalSheet must be used within a ModalSheetProvider");
  }
  return context;
};

export const ModalSheetProvider = ({ children }: PropsWithChildren) => {
  const translateY = useSharedValue(HEIGHT);
  const { top } = useSafeAreaInsets();
  const modalRef = useRef(null);
  const animatedStyles = useAnimatedStyle(() => ({
    borderRadius: interpolate(translateY.value, [HEIGHT, 0], [10, 20]),
    transform: [
      {
        scale: interpolate(translateY.value, [HEIGHT, 0], [1, 0.94]),
      },
      {
        translateY: interpolate(translateY.value, [HEIGHT, 0], [0, top - 10]),
      },
    ],
  }));
  const backdropStyles = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [HEIGHT, 0], [0, 0.5]),
    zIndex: interpolate(translateY.value, [HEIGHT, 0], [-99, 999]),
  }));

  const open = () => {
    translateY.value = withTiming(top + 35);
  };
  const dismiss = () => {
    translateY.value = withTiming(HEIGHT);
  };

  return (
    <ModalSheetContext.Provider value={{ translateY, modalRef, open, dismiss }}>
      <PortalProvider rootHostName="modalSheet">
        <View style={styles.container}>
          <Animated.View style={[styles.animatedContainer, animatedStyles]}>
            <Animated.View style={[styles.backdrop, backdropStyles]} />
            {children}
          </Animated.View>
        </View>
      </PortalProvider>
    </ModalSheetContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: -10,
    left: 0,
    right: 0,
    backgroundColor: "black",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    zIndex: 99,
  },
  animatedContainer: {
    flex: 1,
    overflow: "hidden",
  },
});
