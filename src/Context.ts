import { createContext } from 'react'
import { SharedValue } from 'react-native-reanimated'

export const ModalSheetContext = createContext<{
  // setMinimumHeight: (height: number) => void;
  // translateY: SharedValue<number>;
  // open: () => void;
  // dismiss: () => void;
  // expand: (height?: number, disableSheetStack?: boolean) => void;
  // minimize: (height?: number, disableSheetStack?: boolean) => void;
  minimumHeight: SharedValue<number>
  backdropColor: SharedValue<string>
  backdropOpacity: SharedValue<number>
  isAtMinimumHeight: SharedValue<boolean>
  disableSheetStackEffect: SharedValue<boolean>
  registerModal: (id: string, ref: any) => void
  updateY: (value: number) => void
  addModalToStack: (modalId: string) => void
  removeModalFromStack: (modalId: string) => void
  activeIndex: SharedValue<number>
  modalStack: any[]
}>({
  registerModal: () => {},
  updateY: () => {},
  addModalToStack: () => {},
  removeModalFromStack: () => {},
  activeIndex: { value: 0 },
  modalStack: [],
  isAtMinimumHeight: { value: false },
  minimumHeight: { value: 0 },
  backdropColor: { value: 'black' },
  backdropOpacity: { value: 0.3 },
  disableSheetStackEffect: { value: false },
  // y: { value: 0 },
  // setMinimumHeight: () => {},
  // @ts-ignore
  // translateY: 0,
  // modalRef: null,
  // minimize: () => {},
})
