import { PortalProvider } from '@gorhom/portal'
import { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

import { ModalSheetInternalContext } from './InternalContext'
import { useConstants } from '../utils'
import { ModalSheetRef } from '../types'

function interpolateClamp(value: number, inputRange: number[], outputRange: number[]) {
  'worklet'
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP)
}

const appObj = {
  index: 0,
  id: 'app',
  children: null,
  open: () => {},
  dismiss: () => {},
  expand: () => {},
  minimize: () => {},
  scaleX: { value: 1 },
  translateY: { value: 0 },
  modalHeight: { value: 0 },
  borderRadius: { value: 0 },
  showBackdrop: { value: 0 },
  setDisableSheetStackEffect: () => {},
}

export function ModalSheetInternalProvider({ children }: PropsWithChildren) {
  const { MAX_HEIGHT, HEADER_HEIGHT, MODAL_SHEET_HEIGHT } = useConstants()
  const modalRefs = useRef<Record<string, ModalSheetRef>>({ app: appObj })
  const modalRefsObj = modalRefs.current
  const [modalStack, setModalStack] = useState<ModalSheetRef[]>([appObj])
  const minimumHeight = useSharedValue(0)
  const y = useSharedValue(MAX_HEIGHT)
  const modalHeight = useSharedValue(0)
  const dismissValue = useDerivedValue(
    () => MAX_HEIGHT - (minimumHeight.value === MAX_HEIGHT ? 0 : minimumHeight.value),
  )
  const isAtMinimumHeight = useDerivedValue(() => y.value === dismissValue.value)
  const disableSheetStackEffect = useSharedValue<1 | 0>(0)
  const backdropColor = useSharedValue('black')
  const backdropOpacity = useSharedValue(0.3)
  const activeIndex = useSharedValue(0)
  const childrenAanimatedStyles = useAnimatedStyle(() => {
    if (disableSheetStackEffect.value === 1) {
      return {}
    }
    const borderRadius = interpolateClamp(
      modalHeight.value,
      [minimumHeight.value, MODAL_SHEET_HEIGHT],
      [0, 24],
    )
    const scaleX = interpolateClamp(
      modalHeight.value,
      [minimumHeight.value, MODAL_SHEET_HEIGHT],
      [1, 0.95],
    )
    const translateY = interpolateClamp(
      modalHeight.value,
      [minimumHeight.value, MODAL_SHEET_HEIGHT],
      [0, HEADER_HEIGHT - 5],
    )
    return {
      borderRadius,
      transform: [{ scaleX }, { translateY }],
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

  const updateModalHeight = (value: number) => {
    'worklet'
    modalHeight.value = value
  }

  const addModalToStack = (modalId: string) => {
    setModalStack((stack) => {
      const arr = [...stack, modalRefsObj[modalId]]
      activeIndex.value = arr.length - 1
      return [...stack, modalRefsObj[modalId]]
    })
  }
  const removeModalFromStack = (modalId: string) => {
    setModalStack((stack) => {
      const arr = stack.filter((m) => m.id !== modalId)
      activeIndex.value = arr.length - 1
      return arr
    })
  }

  return (
    <ModalSheetInternalContext.Provider
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
        updateModalHeight,
        modalRefs,
      }}
    >
      <View style={styles.container}>
        <PortalProvider rootHostName="modalSheet">
          <Animated.View style={[styles.animatedContainer, childrenAanimatedStyles]}>
            {children}
          </Animated.View>
        </PortalProvider>
      </View>
    </ModalSheetInternalContext.Provider>
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
    backgroundColor: 'black',
  },
  animatedContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
})
