import { ViewStyle } from 'react-native'
import {
  GestureStateChangeEvent,
  GestureTouchEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { AnimatedStyle, SharedValue } from 'react-native-reanimated'
import { MutableRefObject } from 'react'

export type GestureEvent = GestureStateChangeEvent<PanGestureHandlerEventPayload>

export interface ModalSheetStackRef {
  open: () => void
  dismiss: () => void
  id: string
}

export interface ModalSheetStackProps {
  name: string
  containerStyle?: AnimatedStyle<ViewStyle>
  noHandle?: boolean
  backdropColor?: string
  backdropOpacity?: number
}

export interface ModalSheetRef {
  open: () => void
  dismiss: () => void
  expand: (height?: number, disableSheetEffect?: boolean) => void
  minimize: (height?: number) => void
  setDisableSheetStackEffect: (value: 1 | 0) => void
  scaleX: SharedValue<number>
  borderRadius: SharedValue<number>
  modalHeight: SharedValue<number>
  showBackdrop: SharedValue<number>
  minimizedHeight?: number
  id: string
  children?: React.ReactNode
}
export interface ModalSheetProps {
  name: string
  containerStyle?: AnimatedStyle<ViewStyle>
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

export interface ModalSheetStackProps {
  children: React.ReactNode
}

export interface ModalSheetContextBaseType {
  registerModal: (modalId: string, ref: ModalSheetRef | ModalSheetStackRef) => void
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
