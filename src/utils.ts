import { Dimensions, Platform } from 'react-native'
import {
  interpolate,
  Extrapolation,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const SCREEN_HEIGHT = Dimensions.get('window').height

export function interpolateClamp(
  value: number,
  inputRange: number[],
  outputRange: number[],
) {
  'worklet'
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP)
}

export function animateOpen(value: number) {
  'worklet'
  return withSpring(value, { mass: 0.3, stiffness: 90 })
}

export function animateClose(value: number) {
  'worklet'
  return withTiming(value, { duration: 300 })
}

export function useConstants() {
  const { top } = useSafeAreaInsets()
  const androidTop = Platform.OS === 'android' && top === 0 ? 24 : top
  const topPadding = Platform.select({ ios: top, android: androidTop, default: 24 })
  const MAX_HEIGHT = SCREEN_HEIGHT - topPadding
  const MODAL_SHEET_HEIGHT = MAX_HEIGHT - 16
  const MODAL_SHEET_BORDER_RADIUS = Platform.select({ ios: 40, android: 28, default: 40 })
  const ANIMATE_BORDER_RADIUS = Platform.select({ ios: 24, android: 20, default: 40 })
  const TOP_INSET_HEIGHT = topPadding
  const CHILDREN_Y_POSITION = topPadding - 10
  const SWIPE_VELOCITY_THRESHOLD = 1500

  return {
    MAX_HEIGHT,
    MODAL_SHEET_HEIGHT,
    SCREEN_HEIGHT,
    CHILDREN_Y_POSITION,
    SWIPE_VELOCITY_THRESHOLD,
    MODAL_SHEET_BORDER_RADIUS,
    ANIMATE_BORDER_RADIUS,
    TOP_INSET_HEIGHT,
  }
}
