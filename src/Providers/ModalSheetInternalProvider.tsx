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
import { SCREEN_HEIGHT, animateClose, animateOpen, useConstants } from '../utils'
import { ModalSheetRef, ModalSheetStackRef } from '../types'

function interpolateClamp(value: number, inputRange: number[], outputRange: number[]) {
  'worklet'
  return interpolate(value, inputRange, outputRange, Extrapolation.CLAMP)
}

export function ModalSheetInternalProvider({ children }: PropsWithChildren) {
  const {
    TOP_INSET_HEIGHT,
    CHILDREN_Y_POSITION,
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
    const interpolationInputRange = [0, TOP_INSET_HEIGHT]
    const interpolationOutputRange = [0, CHILDREN_Y_POSITION]
    const borderRadius = interpolateClamp(
      childrenY.value,
      [0, 10],
      [DEFAULT_BORDER_RADIUS, ANIMATE_BORDER_RADIUS],
    )
    const scaleY = interpolateClamp(childrenY.value, interpolationInputRange, [1, 0.95])
    const scaleX = interpolateClamp(childrenY.value, interpolationInputRange, [1, 0.9])
    const translateY = interpolateClamp(
      childrenY.value,
      interpolationInputRange,
      interpolationOutputRange,
    )
    console.log(scaleX, scaleY)
    return {
      borderRadius,
      transform: [{ scaleY }, { scaleX }, { translateY }],
    }
  })
  const backdropStyles = useAnimatedStyle(() => {
    const zIndex = interpolateClamp(activeIndex.value, [-1, 0], [-1, 1])
    const opacity = interpolateClamp(activeIndex.value, [-1, 0], [0, 0.3])
    return {
      opacity,
      zIndex,
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
      // if (index === 0) {
      //   updateY(animateOpen(CHILDREN_Y_POSITION))
      // } else if (index < 0) {
      //   updateY(animateClose(0))
      // }
      currentModal.value = modalStack[index]
    },
  )

  const addModalToStack = (modalId: string) => {
    setModalStack((arr) => [...arr, modalRefsObj[modalId]])
  }
  const removeModalFromStack = (modalId: string) => {
    const arr = modalStack
    const newArr = arr.filter((m) => m.id !== modalId)
    setModalStack(newArr)
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
        <Animated.View style={[styles.backdrop, backdropStyles]} />
        <Animated.View style={[styles.animatedContainer, childrenAnimatedStyles]}>
          {children}
        </Animated.View>
        <PortalHost name="modalSheet" />
        <PortalHost name="modalSheetStack" />
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  animatedContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
})
