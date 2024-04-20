import { ViewStyle } from 'react-native'
import {
  GestureStateChangeEvent,
  GestureTouchEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { AnimatedStyle, SharedValue } from 'react-native-reanimated'

export type GestureEvent = GestureStateChangeEvent<PanGestureHandlerEventPayload>

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
  index: number
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
