import { createContext } from 'react'
import { ModalSheetInternalContextType, ModalSheetStackRef } from '../types'
import { SharedValue } from 'react-native-reanimated'

export const ModalSheetInternalContext = createContext<ModalSheetInternalContextType>({
  registerModal: () => {},
  updateY: () => {},
  addModalToStack: () => {},
  removeModalFromStack: () => {},
  activeIndex: { value: 0 } as SharedValue<number>,
  modalStack: [] as ModalSheetStackRef[],
  minimumHeight: { value: 0 } as SharedValue<number>,
  backdropColor: { value: 'black' } as SharedValue<string>,
  backdropOpacity: { value: 0.3 } as SharedValue<number>,
  updateModalHeight: () => {},
  registerDrawerSheet: () => {},
  addDrawerSheetToStack: () => {},
  removeDrawerSheetFromStack: () => {},
  drawerActiveIndex: { value: 0 } as SharedValue<number>,
  drawerSheetStack: [],
  childrenY: { value: 0 } as SharedValue<number>,
  currentModal: { value: null } as SharedValue<ModalSheetStackRef | null>,
  previousModal: { value: null } as SharedValue<ModalSheetStackRef | null>,
  reset: () => {},
})
