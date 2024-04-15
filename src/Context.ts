import { createContext } from "react";
import { SharedValue } from "react-native-reanimated";

export const ModalSheetContext = createContext<{
  // setMinimumHeight: (height: number) => void;
  // translateY: SharedValue<number>;
  // backdropColor: SharedValue<string>;
  // backdropOpacity: SharedValue<number>;
  // open: () => void;
  // dismiss: () => void;
  // expand: (height?: number, disableSheetStack?: boolean) => void;
  // minimize: (height?: number, disableSheetStack?: boolean) => void;
  // isAtMinimumHeight: SharedValue<boolean>;
  // disableSheetStackEffect: SharedValue<boolean>;
  // y: SharedValue<number>;
  showModal: (id: string) => void;
  hideModal: (id: string) => void;
  registerModal: (id: string, ref: any) => void;
  updateY: (value: number) => void;
  addModalToStack: (modalId: string) => void;
  removeModalFromStack: (modalId: string) => void;
  activeIndex: SharedValue<number>;
  modalStack: any[];
}>({
  showModal: () => {},
  hideModal: () => {},
  registerModal: () => {},
  updateY: () => {},
  addModalToStack: () => {},
  removeModalFromStack: () => {},
  activeIndex: { value: 0 },
  modalStack: [],
  // y: { value: 0 },
  // setMinimumHeight: () => {},
  // @ts-ignore
  // translateY: 0,
  // modalRef: null,
  // minimize: () => {},
});
