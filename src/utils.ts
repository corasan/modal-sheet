import {
  interpolate,
  Extrapolation,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

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
  return withSpring(value, { mass: 0.32, stiffness: 80 })
}

export function animateClose(value: number) {
  'worklet'
  return withTiming(value)
}
