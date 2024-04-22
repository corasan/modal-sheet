import { SharedValue } from 'react-native-reanimated'
import { ModalSheetRef } from '../components/ModalSheet.types'
import { MutableRefObject } from 'react'

export interface ModalSheetContextBaseType {
  registerModal: (modalId: string, ref: MutableRefObject<ModalSheetRef>) => void
  updateY: (value: number) => void
  addModalToStack: (modalId: string) => void
  removeModalFromStack: (modalId: string) => void
  activeIndex: SharedValue<number>
  modalStack: ModalSheetRef[]
  minimumHeight: SharedValue<number>
  backdropColor: SharedValue<string>
  backdropOpacity: SharedValue<number>
  disableSheetStackEffect: SharedValue<number>
  modalRefs: MutableRefObject<Record<string, ModalSheetRef>>
  expand: (
    name: string,
    options?: { height?: number; disableSheetEffect?: boolean },
  ) => void
  open: (name: string) => void
  dismiss: (name?: string) => void
  updateModalHeight: (value: number) => void
}

export type ModalSheetInternalContextType = Omit<
  ModalSheetContextBaseType,
  'expand' | 'open' | 'dismiss'
>

export type ModalSheetContextType = null
