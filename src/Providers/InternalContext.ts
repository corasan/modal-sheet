import { createContext } from 'react'
import { ModalSheetInternalContextType } from './ModalSheetContext.types'
import { SharedValue } from 'react-native-reanimated'

export const ModalSheetInternalContext = createContext<ModalSheetInternalContextType>({
  registerModal: () => {},
  updateY: () => {},
  addModalToStack: () => {},
  removeModalFromStack: () => {},
  activeIndex: { value: 0 } as SharedValue<number>,
  modalRefs: { current: {} },
  modalStack: [],
  minimumHeight: { value: 0 } as SharedValue<number>,
  backdropColor: { value: 'black' } as SharedValue<string>,
  backdropOpacity: { value: 0.3 } as SharedValue<number>,
  disableSheetStackEffect: { value: 0 } as SharedValue<number>,
  updateModalHeight: () => {},
})
