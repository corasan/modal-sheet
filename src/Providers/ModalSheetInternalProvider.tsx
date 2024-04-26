import { PortalHost, PortalProvider } from '@gorhom/portal'
import { PropsWithChildren, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

import { ModalSheetInternalContext } from './InternalContext'
import { useConstants } from '../utils'
import { ModalSheetRef, ModalSheetStackRef } from '../types'

function interpolateClamp(value: number, inputRange: number[], outputRange: number[]) {
  'worklet'
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP)
}

const appObj: ModalSheetStackRef = {
  id: 'app',
  children: undefined,
  open: () => {},
  dismiss: () => {},
  modalHeight: { value: 0 } as SharedValue<number>,
  scaleX: { value: 1 } as SharedValue<number>,
  borderRadius: { value: 0 } as SharedValue<number>,
  showBackdrop: { value: 0 } as SharedValue<number>,
}

export function ModalSheetInternalProvider({ children }: PropsWithChildren) {
  const { MAX_HEIGHT, HEADER_HEIGHT, MODAL_SHEET_HEIGHT } = useConstants()
  const modalRefs = useRef<Record<string, ModalSheetStackRef>>({ app: appObj })
  const drawerSheetRefs = useRef<Record<string, ModalSheetRef>>({})
  const modalRefsObj = modalRefs.current
  const [modalStack, setModalStack] = useState<ModalSheetStackRef[]>([appObj])
  const [drawerSheetStack, setDrawerSheetStack] = useState<ModalSheetRef[]>([])
  const minimumHeight = useSharedValue(0)
  const y = useSharedValue(MAX_HEIGHT)
  const modalHeight = useSharedValue(0)
  const disableSheetStackEffect = useSharedValue<1 | 0>(0)
  const backdropColor = useSharedValue('black')
  const backdropOpacity = useSharedValue(0.3)
  const activeIndex = useSharedValue(0)
  const drawerActiveIndex = useSharedValue(0)
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

  const registerDrawerSheet = (modalId: string, ref: any) => {
    drawerSheetRefs.current[modalId] = {
      ...{
        ...ref,
        index: Object.keys(drawerSheetRefs.current).length,
      },
    }
  }

  const updateY = (value: number) => {
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

  const addDrawerSheetToStack = (modalId: string) => {
    setDrawerSheetStack((stack) => {
      const arr = [...stack, drawerSheetRefs.current[modalId]]
      drawerActiveIndex.value = arr.length - 1
      return [...stack, drawerSheetRefs.current[modalId]]
    })
  }
  const removeDrawerSheetFromStack = (modalId: string) => {
    setDrawerSheetStack((stack) => {
      const arr = stack.filter((m) => m.id !== modalId)
      if (arr.length === 0) {
        drawerActiveIndex.value = 0
      } else {
        drawerActiveIndex.value = arr.length - 1
      }
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
        minimumHeight,
        backdropColor,
        backdropOpacity,
        disableSheetStackEffect,
        updateModalHeight,
        registerDrawerSheet,
        addDrawerSheetToStack,
        removeDrawerSheetFromStack,
        drawerSheetStack,
        drawerActiveIndex,
      }}
    >
      <View style={styles.container}>
        <PortalProvider>
          <Animated.View style={[styles.animatedContainer, childrenAanimatedStyles]}>
            {children}
          </Animated.View>
          <PortalHost name="modalSheet" />
          <PortalHost name="modalSheetStack" />
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
