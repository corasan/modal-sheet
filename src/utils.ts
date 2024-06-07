import { Dimensions } from 'react-native'
import {
  interpolate,
  Extrapolation,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const HEIGHT = Dimensions.get('window').height

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
  return withSpring(value, { mass: 0.30, stiffness: 90 })
}

export function animateClose(value: number) {
  'worklet'
  return withTiming(value, { duration: 250 })
}

export function useConstants() {
  const { top } = useSafeAreaInsets()
  const MAX_HEIGHT = HEIGHT - top
  const MODAL_SHEET_HEIGHT = MAX_HEIGHT - 10

  return {
    MAX_HEIGHT,
    MODAL_SHEET_HEIGHT,
    HEADER_HEIGHT: top,
    SCREEN_HEIGHT: HEIGHT,
    SWIPE_VELOCITY_THRESHOLD: 1500,
  }
}
