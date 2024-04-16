import { useCallback, useContext } from 'react'
import { Dimensions } from 'react-native'
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ModalSheetContext } from './Context'

const HEIGHT = Dimensions.get('window').height

export function useModalSheet() {
  const context = useContext(ModalSheetContext)
  if (!context) {
    throw new Error('useModalSheet must be used within a ModalSheetProvider')
  }

  const { open, expand, dismiss } = context
  return {
    open,
    expand,
    dismiss,
    // minimize,
    // dismiss,
    // setMinimumHeight,
    // isAtMinimumHeight,
  }
}
