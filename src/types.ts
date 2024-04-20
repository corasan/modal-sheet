import { MutableRefObject } from 'react'
import { ViewStyle } from 'react-native'
import {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
  GestureTouchEvent,
} from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

export type GestureEvent = GestureStateChangeEvent<PanGestureHandlerEventPayload>

export interface ModalSheetRef {
  open: () => void
  dismiss: () => void
  expand: (height?: number, disableSheetEffect?: boolean) => void
  minimize: (height?: number) => void
  setDisableSheetStackEffect: (value: 1 | 0) => void
  scaleX: Animated.SharedValue<number>
  borderRadius: Animated.SharedValue<number>
  modalHeight: Animated.SharedValue<number>
  showBackdrop: Animated.SharedValue<number>
  minimizedHeight?: number
  id: string
  index: number
  children?: React.ReactNode
}

export interface ModalSheetProps {
  name: string
  containerStyle?: Animated.AnimateStyle<ViewStyle>
  noHandle?: boolean
  backdropColor?: string
  backdropOpacity?: number
  minimizedHeight?: number
  disableSheetStackEffect?: boolean
  onGestureUpdate?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void
  onGestureBegin?: (e: GestureEvent) => void
  onGestureStarts?: (e: GestureEvent) => void
  onGestureEnd?: (e: GestureEvent) => void
  onGestureFinalize?: (e: GestureEvent) => void
  onGestureTouchesDown?: (e: GestureTouchEvent) => void
  onGestureTouchesUp?: (e: GestureTouchEvent) => void
  onGestureTouchesMove?: (e: GestureTouchEvent) => void
  onGestureTouchesCancelled?: (e: GestureTouchEvent) => void
}

export interface ModalSheetContextBaseType {
  registerModal: (modalId: string, ref: MutableRefObject<ModalSheetRef>) => void
  updateY: (value: number) => void
  addModalToStack: (modalId: string) => void
  removeModalFromStack: (modalId: string) => void
  activeIndex: Animated.SharedValue<number>
  modalStack: ModalSheetRef[]
  isAtMinimumHeight: Animated.SharedValue<boolean>
  minimumHeight: Animated.SharedValue<number>
  backdropColor: Animated.SharedValue<string>
  backdropOpacity: Animated.SharedValue<number>
  disableSheetStackEffect: Animated.SharedValue<1 | 0>
  modalRefs: MutableRefObject<Record<string, ModalSheetRef>>
  expand: (
    name: string,
    options?: { height?: number; disableSheetEffect?: boolean },
  ) => void
  open: (name: string) => void
  dismiss: (name?: string) => void
  updateModalHeight: (value: number) => void
}

export type ModalSheetInternalContextType = ModalSheetContextBaseType

export type ModalSheetContextType = Pick<
  ModalSheetContextBaseType,
  'open' | 'dismiss' | 'expand'
>
