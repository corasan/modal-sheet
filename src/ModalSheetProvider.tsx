import { PortalProvider } from '@gorhom/portal'
import { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

import { ModalSheetContext } from './Context'
import { useConstants } from './utils'
import { ModalSheetRef } from './types'

function interpolateClamp(value: number, inputRange: number[], outputRange: number[]) {
  'worklet'
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP)
}

const childrenObj = {
  children: null,
  open: () => {},
  dismiss: () => {},
  translateY: { value: 0 },
  scaleX: { value: 1 },
  borderRadius: { value: 0 },
  modalHeight: { value: 0 },
  id: 'children',
  index: 0,
  showBackdrop: 0,
}

export function ModalSheetProvider({ children }: PropsWithChildren) {
  const { MAX_HEIGHT, HEADER_HEIGHT, MODAL_SHEET_HEIGHT } = useConstants()
  const modalRefs = useRef<Record<string, ModalSheetRef>>({ children: childrenObj })
  const modalRefsObj = modalRefs.current
  const [modalStack, setModalStack] = useState<ModalSheetRef[]>([childrenObj])
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

  const open = (name: string) => {
    'worklet'
    modalRefs.current[name].open()
  }

  const dismiss = (name?: string) => {
    'worklet'
    if (!name) {
      name = modalStack[activeIndex.value].id
    }
    modalRefsObj[name].dismiss()
  }

  const expand = useCallback(
    (name: string, options?: { height?: number; disableSheetEffect?: boolean }) => {
      'worklet'
      modalRefs.current[name].expand(options?.height, options?.disableSheetEffect)
    },
    [modalRefs],
  )

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
        expand,
        open,
        dismiss,
        updateModalHeight,
      }}
    >
      <View style={styles.container}>
        <PortalProvider rootHostName="modalSheet">
          <Animated.View style={[styles.animatedContainer, childrenAanimatedStyles]}>
            {children}
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
    backgroundColor: 'black',
  },
  animatedContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
})
