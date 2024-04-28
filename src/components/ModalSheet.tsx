import { Portal } from '@gorhom/portal'
import {
  PropsWithChildren,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { View, StyleSheet } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { animateClose, animateOpen, interpolateClamp, useConstants } from '../utils'
import { ModalSheetProps, ModalSheetRef } from '../types'
import { useInternal } from '../hooks/useInternal'
import React from 'react'
import { ModalSheetChild } from './ModalSheetChild'

export const ModalSheet = forwardRef<ModalSheetRef, PropsWithChildren<ModalSheetProps>>(
  (
    {
      name,
      noHandle = false,
      backdropColor = 'black',
      backdropOpacity = 0.3,
      children,
      sizes = [100, 300, 500],
      offset = 0,
      ...props
    },
    ref,
  ) => {
    const {
      registerDrawerSheet,
      addDrawerSheetToStack,
      removeDrawerSheetFromStack,
      drawerActiveIndex,
      drawerSheetStack,
      modalStack,
    } = useInternal()
    const {
      MAX_HEIGHT,
      MODAL_SHEET_HEIGHT,
      HEADER_HEIGHT,
      SCREEN_HEIGHT,
      SWIPE_VELOCITY_THRESHOLD,
    } = useConstants()
    const modalHeight = useSharedValue(sizes[0])
    const scaleX = useSharedValue(1)
    const borderRadius = useSharedValue(40)
    const showBackdrop = useSharedValue(0)
    const [prevHeights, setPrevHeights] = useState({})
    const translateY = useSharedValue(0)
    const [contentHeight, setContentHeight] = useState(0)
    const [initialContentHeight, setInitialContentHeight] = useState(0)

    const modalStyle = useAnimatedStyle(() => {
      return {
        borderTopLeftRadius: borderRadius.value,
        borderTopRightRadius: borderRadius.value,
      }
    })
    const containerStyle = useAnimatedStyle(() => {
      const contentGrowth = contentHeight - initialContentHeight
      const newHeight =
        contentHeight + contentGrowth > modalHeight.value &&
        contentHeight > modalHeight.value
          ? modalHeight.value + contentGrowth
          : modalHeight.value
      return {
        borderTopLeftRadius: borderRadius.value,
        borderTopRightRadius: borderRadius.value,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowRadius: 8,
        shadowOpacity: interpolateClamp(
          modalHeight.value,
          [sizes[0], MODAL_SHEET_HEIGHT],
          [0.05, 0.1],
        ),
        transform: [{ scaleX: scaleX.value }, { translateY: translateY.value }],
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [0, 9]),
        height: newHeight,
      }
    })
    const backdropStyles = useAnimatedStyle(() => {
      return {
        opacity: interpolateClamp(showBackdrop.value, [0, 1], [0, backdropOpacity]),
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [-1, 0]),
        backgroundColor: backdropColor,
      }
    })

    // This function is used to expand the modal to a specific height
    // If the height is not provided, the modal will expand to its maximum height
    /**
     * @param {1 | 2 | 'full'} index - The index of the size array to expand to
     */
    const expand = useCallback(
      (index?: 1 | 2 | 'full') => {
        showBackdrop.value = animateOpen(1)
        if (index === 'full' || !index) {
          translateY.value = animateOpen(offset)
          addDrawerSheetToStack(name)
          modalHeight.value = animateOpen(MODAL_SHEET_HEIGHT)
          // Animate the modal behind if there is a stack of modals
          // When a new modal is opened, the previous modal should be moved to the back
          const behindModalRef = drawerSheetStack[drawerActiveIndex.value]
          if (behindModalRef) {
            behindModalRef.modalHeight.value = animateClose(MAX_HEIGHT + 5)
            behindModalRef.scaleX.value = animateClose(0.96)
            behindModalRef.borderRadius.value = animateClose(24)
            behindModalRef.showBackdrop.value = withTiming(0, { duration: 100 })
          }
          return
        }
        modalHeight.value = animateOpen(sizes[index] ?? sizes[0])
      },
      [drawerSheetStack],
    )

    // This function is used to minimize the modal to a specific height
    // If the height is not provided, the modal will minimize to its minimized height
    /**
     * @param {0 | 1 | 2} index - The index of the size array to minimize to
     */
    const minimize = useCallback(
      (index?: 0 | 1 | 2) => {
        removeDrawerSheetFromStack(name)
        if (drawerSheetStack.length > 0) {
          const behindModalRef = drawerSheetStack[drawerActiveIndex.value - 1]
          if (behindModalRef) {
            behindModalRef.modalHeight.value = animateClose(MODAL_SHEET_HEIGHT)
            behindModalRef.scaleX.value = animateClose(1)
            behindModalRef.borderRadius.value = animateClose(40)
            behindModalRef.showBackdrop.value = withTiming(1, { duration: 100 })
          }
        }
        translateY.value = animateClose(0)
        if (index === 0 || !index) {
          showBackdrop.value = animateClose(0)
        }
        if (!index) {
          modalHeight.value = animateClose(sizes[0])
          return
        }
        modalHeight.value = animateClose(sizes[index] ?? sizes[0])
      },
      [drawerSheetStack],
    )

    const gesture = Gesture.Pan()
      .onUpdate((e) => {
        if (drawerActiveIndex.value > 0 && e.absoluteY <= HEADER_HEIGHT) {
          return
        } else if (drawerActiveIndex.value <= 0 && e.absoluteY < HEADER_HEIGHT + 10) {
          return
        }
        let moveVal
        if (e.translationY < 0) {
          moveVal = SCREEN_HEIGHT - 70 - e.absoluteY
        } else {
          moveVal = SCREEN_HEIGHT - e.absoluteY
        }
        modalHeight.value = moveVal
        // Animate the modal behind if there is a stack of modals
        // When the current modal is dragged, the modal behind animates with it
        const behindModalRef = drawerSheetStack[drawerActiveIndex.value - 1]
        if (behindModalRef) {
          const val = interpolateClamp(
            moveVal,
            [0, MODAL_SHEET_HEIGHT - offset],
            [MODAL_SHEET_HEIGHT - offset, MAX_HEIGHT - offset + 5],
          )
          behindModalRef.modalHeight.value = val
          behindModalRef.scaleX.value = interpolateClamp(
            moveVal,
            [sizes[0], MODAL_SHEET_HEIGHT - offset],
            [1, 0.96],
          )
        }
      })
      .onEnd((e) => {
        const { absoluteY, velocityY, translationY } = e
        const size0 = MAX_HEIGHT - sizes[0]
        const size1 = MAX_HEIGHT - sizes[1]
        const size2 = sizes[2] ? MAX_HEIGHT - sizes[2] : 0

        if (translationY < 0) {
          // Swiping up
          if (absoluteY < size0 && velocityY < -SWIPE_VELOCITY_THRESHOLD) {
            // Swipe up fast from minimized state, expand to full
            runOnJS(expand)('full')
          } else if (size2 && absoluteY < size2) {
            // Swipe up fast from size[1], expand to size[2]
            runOnJS(expand)('full')
          } else if (absoluteY < size1) {
            // Swipe up from minimized state, expand to size[1]
            runOnJS(expand)(2)
          } else if (absoluteY < size0) {
            // Swipe up not fast enough or from other states, minimize
            runOnJS(expand)(1)
          } else {
            // Swipe up from expanded state, minimize to size[0]
            runOnJS(minimize)(0)
          }
        } else {
          // Swiping down
          if (
            absoluteY > MAX_HEIGHT - MODAL_SHEET_HEIGHT &&
            velocityY > SWIPE_VELOCITY_THRESHOLD
          ) {
            // Swipe down fast from expanded state, minimize to size[0]
            runOnJS(minimize)(0)
          } else if (absoluteY > size1) {
            // Swipe down slow to minimize to size[0]
            runOnJS(minimize)(0)
          } else if (size2 && absoluteY > size2) {
            // Swipe down slow to minimize to size[1]
            runOnJS(minimize)(1)
          } else if (size2 && absoluteY > MAX_HEIGHT - MODAL_SHEET_HEIGHT) {
            // Swipe down slow to minimize to size[2]
            runOnJS(minimize)(2)
          } else {
            // Swipe down default to minimize to size[0]
            runOnJS(minimize)(0)
          }
        }
      })

    const onLayoutChange = (currentHeight: number, initialHeight: number) => {
      setContentHeight(currentHeight)
      setInitialContentHeight(initialHeight)
    }

    useImperativeHandle(ref, () => ({
      scaleX,
      borderRadius,
      id: name,
      expand,
      minimize,
      modalHeight,
      showBackdrop,
      translateY,
    }))

    useEffect(() => {
      // Register the modal with the context
      if (ref && 'current' in ref && ref.current) {
        registerDrawerSheet(name, ref.current)
      }
    }, [name, ref])

    useEffect(() => {
      if (drawerSheetStack.length > 0 && modalStack.length > 1) {
        const newPrevHeights = {}
        drawerSheetStack.forEach((modal) => {
          newPrevHeights[modal.id] = modal.modalHeight.value
          modal.modalHeight.value = animateClose(sizes[0])
        })
        setPrevHeights(newPrevHeights)
      } else if (drawerSheetStack.length > 0 && modalStack.length === 1) {
        drawerSheetStack.forEach((modal) => {
          if (prevHeights[modal.id]) {
            modal.modalHeight.value = animateClose(prevHeights[modal.id])
          }
        })
        setPrevHeights({})
      }
    }, [drawerSheetStack, modalStack])

    return (
      <Portal hostName="modalSheet">
        <Animated.View style={[styles.backdrop, { bottom: offset }, backdropStyles]} />
        <Animated.View
          style={[
            styles.container,
            props.containerStyle,
            { bottom: offset },
            containerStyle,
          ]}
        >
          <Animated.View style={[styles.permanentContainer, modalStyle]}>
            <GestureDetector gesture={gesture}>
              <View style={styles.handleContainer}>
                {!noHandle && <View style={styles.handle} />}
              </View>
            </GestureDetector>
            <ModalSheetChild onLayoutChange={onLayoutChange}>{children}</ModalSheetChild>
          </Animated.View>
        </Animated.View>
      </Portal>
    )
  },
)

const styles = StyleSheet.create({
  permanentContainer: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  handleContainer: {
    height: 40,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    height: 5,
    width: '10%',
    borderRadius: 100,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
})
