import { ViewStyle } from 'react-native'
import {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { AnimatedStyle, SharedValue } from 'react-native-reanimated'

export type GestureEvent = GestureStateChangeEvent<PanGestureHandlerEventPayload>

export interface ModalSheetStackRef {
  open: () => void
  dismiss: () => void
  id: string
  children?: React.ReactNode
  modalHeight: SharedValue<number>
  scale: SharedValue<number>
  borderRadius: SharedValue<number>
  showBackdrop: SharedValue<number>
  translateY: SharedValue<number>
}

export interface ModalSheetStackProps {
  name: string
  containerStyle?: AnimatedStyle<ViewStyle>
  noHandle?: boolean
  backdropColor?: string
  backdropOpacity?: number
}

export interface ModalSheetRef {
  expand: (index?: 1 | 2 | 'full') => void
  minimize: (index?: 0 | 1 | 2) => void
  borderRadius: SharedValue<number>
  showBackdrop: SharedValue<number>
  modalHeight: SharedValue<number>
  translateY: SharedValue<number>
  scaleX: SharedValue<number>
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
  sizes?: [number, number, number?]
  offset: number
  // minimizedHeight?: number
  // disableSheetStackEffect?: boolean
  // onGestureUpdate?: (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void
  // onGestureBegin?: (e: GestureEvent) => void
  // onGestureStarts?: (e: GestureEvent) => void
  // onGestureEnd?: (e: GestureEvent) => void
  // onGestureFinalize?: (e: GestureEvent) => void
  // onGestureTouchesDown?: (e: GestureTouchEvent) => void
  // onGestureTouchesUp?: (e: GestureTouchEvent) => void
  // onGestureTouchesMove?: (e: GestureTouchEvent) => void
  // onGestureTouchesCancelled?: (e: GestureTouchEvent) => void
}

export interface ModalSheetStackProps {
  children: React.ReactNode
}

export interface ModalSheetContextBaseType {
  registerModal: (modalId: string, ref: ModalSheetStackRef) => void
  registerDrawerSheet: (modalId: string, ref: ModalSheetRef) => void
  updateY: (value: number) => void
  addModalToStack: (modalId: string) => void
  removeModalFromStack: (modalId: string) => void
  addDrawerSheetToStack: (modalId: string) => void
  removeDrawerSheetFromStack: (modalId: string) => void
  activeIndex: SharedValue<number>
  drawerActiveIndex: SharedValue<number>
  modalStack: ModalSheetStackRef[]
  drawerSheetStack: ModalSheetRef[]
  minimumHeight: SharedValue<number>
  backdropColor: SharedValue<string>
  backdropOpacity: SharedValue<number>
  expand: (
    name: string,
    options?: { height?: number; disableSheetEffect?: boolean },
  ) => void
  open: (name: string) => void
  dismiss: (name?: string) => void
  updateModalHeight: (value: number) => void
  childrenY: SharedValue<number>,
  currentModal: SharedValue<ModalSheetStackRef | null>,
  previousModal: SharedValue<ModalSheetStackRef | null>
}

export type ModalSheetInternalContextType = Omit<
  ModalSheetContextBaseType,
  'expand' | 'open' | 'dismiss'
>

export type ModalSheetContextType = null
