import { PortalProvider } from '@gorhom/portal'
import { PropsWithChildren, useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ModalSheetContext } from './Context'

const HEIGHT = Dimensions.get('window').height

function interpolateClamp(value: number, inputRange: number[], outputRange: number[]) {
  'worklet'
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP)
}

type ModalRef = {
  show: () => void
  hide: () => void
  translateY: SharedValue<number>
  id: string
  index: number
  [key: string]: any
}

const childrenObj = {
  children: null,
  show: () => {},
  hide: () => {},
  translateY: { value: 0 },
  scaleX: { value: 1 },
  borderRadius: { value: 0 },
  id: 'children',
  index: 0,
}

export function ModalSheetProvider({ children }: PropsWithChildren) {
  const { top } = useSafeAreaInsets()
  const modalRefs = useRef<Record<string, any>>({ children: childrenObj })
  const modalRefsObj = modalRefs.current
  const [modalStack, setModalStack] = useState<ModalRef[]>([childrenObj])
  const minimumHeight = useSharedValue(HEIGHT)
  const y = useSharedValue(HEIGHT)
  const dismissValue = useDerivedValue(
    () => HEIGHT - (minimumHeight.value === HEIGHT ? 0 : minimumHeight.value),
  )
  const isAtMinimumHeight = useDerivedValue(() => y.value === dismissValue.value)
  const disableSheetStackEffect = useSharedValue(false)
  const backdropColor = useSharedValue('black')
  const backdropOpacity = useSharedValue(0.3)
  const activeIndex = useSharedValue(0)
  const childrenAanimatedStyles = useAnimatedStyle(() => {
    if (disableSheetStackEffect.value) {
      return {}
    }
    const borderRadius = interpolateClamp(y.value, [dismissValue.value, 0], [0, 24])
    const scaleX = interpolateClamp(y.value, [dismissValue.value, 0], [1, 0.95])
    const translateY = interpolateClamp(y.value, [dismissValue.value, 0], [0, top - 20])
    const scaleY = interpolateClamp(y.value, [dismissValue.value, 0], [1, 0.95])
    return {
      borderRadius,
      transform: [{ scaleX }, { scaleY }, { translateY }],
    }
  })
  const backdropStyles = useAnimatedStyle(() => {
    if (isAtMinimumHeight.value) {
      return { zIndex: -99, opacity: 0 }
    }
    return {
      opacity: interpolateClamp(y.value, [dismissValue.value, 0], [0, 0.4]),
      zIndex: interpolateClamp(y.value, [dismissValue.value, 0], [0, 99]),
    }
  })

  const registerModal = (modalId: string, ref: any) => {
    modalRefs.current[modalId] = {
      ...{
        ...ref,
        index: Object.keys(modalRefs.current).length,
      },
    }
  }

  const updateY = (value: number) => {
    'worklet'
    y.value = value
  }

  const addModalToStack = (modalId: string) => {
    'worklet'
    activeIndex.value = Object.keys(modalRefsObj).indexOf(modalId)
    setModalStack((stack) => [...stack, modalRefsObj[modalId]])
  }
  const removeModalFromStack = (modalId: string) => {
    'worklet'
    setModalStack((stack) => {
      const arr = stack.filter((modal) => modal.modalId !== modalId)
      if (activeIndex.value > 0) {
        activeIndex.value = activeIndex.value - 1
      }
      return arr
    })
  }

  return (
    <ModalSheetContext.Provider
      value={{
        registerModal,
        updateY,
        addModalToStack,
        removeModalFromStack,
        activeIndex,
        modalStack,
        isAtMinimumHeight,
        minimumHeight,
        backdropColor,
        backdropOpacity,
        disableSheetStackEffect,
      }}
    >
      <View style={styles.container}>
        <PortalProvider rootHostName="modalSheet">
          <Animated.View style={[styles.animatedContainer, childrenAanimatedStyles]}>
            <Animated.View style={[styles.backdrop, backdropStyles]} />
            <View style={{ flex: 1, backgroundColor: 'white', overflow: 'hidden' }}>
              {children}
            </View>
          </Animated.View>
        </PortalProvider>
      </View>
    </ModalSheetContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    backgroundColor: 'black',
  },
  animatedContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
})
