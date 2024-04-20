import { createContext } from 'react'
import { SharedValue } from 'react-native-reanimated'
import { ModalSheetContextType } from './types'

export const ModalSheetContext = createContext<ModalSheetContextType>({
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
  disableSheetStackEffect: { value: 0 },
  expand: () => {},
  open: () => {},
  dismiss: () => {},
  updateModalHeight: () => {},
})
