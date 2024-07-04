import { PortalHost, PortalProvider } from '@gorhom/portal'
import { PropsWithChildren, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

import { ModalSheetInternalContext } from './InternalContext'
import { animateClose, animateOpen, useConstants } from '../utils'
import { ModalSheetRef, ModalSheetStackRef } from '../types'

function interpolateClamp(value: number, inputRange: number[], outputRange: number[]) {
  'worklet'
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP)
}

export function ModalSheetInternalProvider({ children }: PropsWithChildren) {
  const {
    HEADER_HEIGHT,
    MODAL_SHEET_HEIGHT,
    DEFAULT_BORDER_RADIUS,
    ANIMATE_BORDER_RADIUS,
  } = useConstants()
  const modalRefs = useRef<Record<string, ModalSheetStackRef>>({})
  const drawerSheetRefs = useRef<Record<string, ModalSheetRef>>({})
  const modalRefsObj = modalRefs.current
  const [modalStack, setModalStack] = useState<ModalSheetStackRef[]>([])
  const [drawerSheetStack, setDrawerSheetStack] = useState<ModalSheetRef[]>([])
  const minimumHeight = useSharedValue(0)
  const childrenY = useSharedValue(0)
  const modalHeight = useSharedValue(0)
  const backdropColor = useSharedValue('black')
  const backdropOpacity = useSharedValue(0.3)
  const activeIndex = useDerivedValue(() => {
    return modalStack.length - 1
  })
  const drawerActiveIndex = useSharedValue(0)
  const currentModal = useSharedValue<ModalSheetStackRef | null>(null)
  const previousModal = useSharedValue<ModalSheetStackRef | null>(null)
  const childrenAnimatedStyles = useAnimatedStyle(() => {
    const borderRadius = interpolateClamp(
      childrenY.value,
      [minimumHeight.value, MODAL_SHEET_HEIGHT],
      [DEFAULT_BORDER_RADIUS, ANIMATE_BORDER_RADIUS],
    )
    const scale = interpolateClamp(
      childrenY.value,
      [minimumHeight.value, MODAL_SHEET_HEIGHT],
      [1, 0.95],
    )
    const translateY = interpolateClamp(
      childrenY.value,
      [0, MODAL_SHEET_HEIGHT],
      [0, HEADER_HEIGHT - 25],
    )
    return {
      borderRadius,
      transform: [{ scale }, { translateY }],
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
    'worklet'
    childrenY.value = value
  }

  const updateModalHeight = (value: number) => {
    'worklet'
    modalHeight.value = value
  }

  useAnimatedReaction(
    () => activeIndex.value,
    (index) => {
      if (index === 0) {
        updateY(animateOpen(MODAL_SHEET_HEIGHT))
      } else if (index < 0) {
        updateY(animateClose(0))
      }
      currentModal.value = modalStack[index]
      previousModal.value = modalStack[index - 1]
    },
  )

  const addModalToStack = (modalId: string) => {
    setModalStack((stack) => {
      return [...stack, modalRefsObj[modalId]]
    })
  }
  const removeModalFromStack = (modalId: string) => {
    setModalStack((stack) => {
      const arr = stack.filter((m) => m.id !== modalId)
      // if (arr.length === 0) {
      //   activeIndex.value = 0
      // } else {
      //   activeIndex.value = arr.length - 1
      // }
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
        updateModalHeight,
        registerDrawerSheet,
        addDrawerSheetToStack,
        removeDrawerSheetFromStack,
        drawerSheetStack,
        drawerActiveIndex,
        childrenY,
        currentModal,
        previousModal,
      }}
    >
      <View style={styles.container}>
        <PortalProvider>
        <Animated.View style={[styles.animatedContainer, childrenAnimatedStyles]}>
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
