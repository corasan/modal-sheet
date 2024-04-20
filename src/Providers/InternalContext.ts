import { createContext } from 'react'
import { ModalSheetInternalContextType } from '../types'

export const ModalSheetInternalContext = createContext<ModalSheetInternalContextType>({
  registerModal: () => {},
  updateY: () => {},
  addModalToStack: () => {},
  removeModalFromStack: () => {},
  activeIndex: { value: 0 },
  modalRefs: { current: {} },
  modalStack: [],
  isAtMinimumHeight: { value: false },
  minimumHeight: { value: 0 },
  backdropColor: { value: 'black' },
  backdropOpacity: { value: 0.3 },
  disableSheetStackEffect: { value: 0 },
  updateModalHeight: () => {},
  expand: () => {},
  open: () => {},
  dismiss: () => {},
})
