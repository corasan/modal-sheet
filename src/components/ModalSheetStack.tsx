import { Portal } from '@gorhom/portal'
import { PropsWithChildren, forwardRef, useEffect, useImperativeHandle } from 'react'
import { View, StyleSheet } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { animateClose, animateOpen, interpolateClamp, useConstants } from '../utils'
import { ModalSheetStackProps, ModalSheetStackRef } from '../types'
import { useInternal } from '../hooks/useInternal'

export const ModalSheetStack = forwardRef<
  ModalSheetStackRef,
  PropsWithChildren<ModalSheetStackProps>
>(
  (
    { name, noHandle = false, backdropColor, backdropOpacity, children, ...props },
    ref,
  ) => {
    const {
      registerModal,
      addModalToStack,
      removeModalFromStack,
      activeIndex,
      backdropColor: bckdropColor,
      backdropOpacity: bckdropOpacity,
      updateY,
      currentModal,
      previousModal,
    } = useInternal()
    const {
      MAX_HEIGHT,
      MODAL_SHEET_HEIGHT,
      HEADER_HEIGHT,
      SCREEN_HEIGHT,
      ANIMATE_BORDER_RADIUS,
      DEFAULT_BORDER_RADIUS,
    } = useConstants()
    const modalHeight = useSharedValue(0)
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const scale = useSharedValue(1)
    const borderRadius = useSharedValue(40)
    const showBackdrop = useSharedValue(0)
    const gesture = Gesture.Pan()
      .onUpdate((e) => {
        if (e.absoluteY < HEADER_HEIGHT + 20) {
          console.log('HERE')
          return
        }
        const moveVal = e.absoluteY - HEADER_HEIGHT - 20
        translateY.value = moveVal
        if (activeIndex.value === 0) {
          updateY(
            interpolateClamp(
              e.absoluteY,
              [0, SCREEN_HEIGHT],
              [MODAL_SHEET_HEIGHT, MAX_HEIGHT],
            ),
          )
        }
        // // Animate the modal behind if there is a stack of modals
        // // When the current modal is dragged, the modal behind animates with it
        // const behindModalRef = modalStack[activeIndex.value - 1]

        if (previousModal.value) {
          // console.log('THE PREVIOUS MODAL', previousModal.value.id)
          // console.log(moveVal)
          const val = interpolateClamp(
            moveVal,
            [0, HEADER_HEIGHT],
            [MODAL_SHEET_HEIGHT, 0],
          )
          console.log(moveVal, val)
          previousModal.value.translateY.value = val
          // previousModal.value.borderRadius.value = interpolateClamp(
          //   moveVal,
          //   [0, MODAL_SHEET_HEIGHT],
          //   [DEFAULT_BORDER_RADIUS, ANIMATE_BORDER_RADIUS],
          // )
          // previousModal.value.scale.value = interpolateClamp(
          //   moveVal,
          //   [0, MODAL_SHEET_HEIGHT],
          //   [1, 0.95],
          // )
        }
      })
      .onEnd((e) => {
        translateY.value = animateOpen(0)
        // if (e.translationY < 80) {
        //   translateY.value = animateOpen(0)
        //   showBackdrop.value = animateOpen(1)
        //   if (activeIndex.value === 0) {
        //     updateY(animateOpen(SCREEN_HEIGHT))
        //   }
        //   if (e.absoluteY < HEADER_HEIGHT) {
        //     return
        //   }
        // } else {
        //   translateY.value = animateClose(SCREEN_HEIGHT)
        //   showBackdrop.value = animateClose(0)
        //   updateY(animateClose(0))
        //   runOnJS(removeModalFromStack)(name)
        // }
      })
    const modalStyle = useAnimatedStyle(() => {
      return {
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [1, 10]),
        borderTopLeftRadius: borderRadius.value,
        borderTopRightRadius: borderRadius.value,
        height: MODAL_SHEET_HEIGHT,
        borderWidth: 1,
        borderColor: 'tomato',
        transform: [
          {
            scale: scale.value,
          },
          {
            translateY: translateY.value,
          },
        ],
      }
    })
    const backdropStyles = useAnimatedStyle(() => {
      return {
        opacity: interpolateClamp(showBackdrop.value, [0, 1], [0, 0.3]),
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [-1, 0]),
      }
    })

    useAnimatedReaction(
      () => previousModal.value,
      (previousModal) => {
        if (previousModal) {
          previousModal.translateY.value = animateClose(-40)
          previousModal.scale.value = animateClose(0.95)
          previousModal.borderRadius.value = animateClose(ANIMATE_BORDER_RADIUS)
          previousModal.showBackdrop.value = animateClose(0)
        }
      },
    )

    useAnimatedReaction(
      () => currentModal.value,
      (currentModal) => {
        if (currentModal) {
          currentModal.translateY.value = animateOpen(0)
          currentModal.scale.value = animateOpen(1)
          currentModal.borderRadius.value = animateOpen(DEFAULT_BORDER_RADIUS)
          currentModal.showBackdrop.value = animateOpen(1)
        }
      },
    )

    const open = () => {
      'worklet'
      addModalToStack(name)
      translateY.value = animateOpen(0)
      showBackdrop.value = animateOpen(1)
    }

    const dismiss = () => {
      translateY.value = animateClose(SCREEN_HEIGHT)
      showBackdrop.value = animateClose(0)
      removeModalFromStack(name)
    }

    useImperativeHandle(ref, () => ({
      open,
      dismiss,
      id: name,
      modalHeight,
      scale,
      borderRadius,
      showBackdrop,
      translateY,
    }))

    useEffect(() => {
      // Register the modal with the context
      if (ref && 'current' in ref && ref.current) {
        registerModal(name, ref.current)
      }
    }, [name, ref])

    useEffect(() => {
      if (backdropColor && backdropColor !== 'black') {
        bckdropColor.value = backdropColor
      }
      if (backdropOpacity && backdropOpacity !== 0.4) {
        bckdropOpacity.value = backdropOpacity
      }
    }, [backdropOpacity, backdropOpacity])

    return (
      <Portal hostName="modalSheetStack">
        <Animated.View style={[styles.backdrop, backdropStyles]} />
        <Animated.View
          style={[
            styles.container,
            props.containerStyle,
            styles.permanentContainer,
            modalStyle,
          ]}
        >
          <GestureDetector gesture={gesture}>
            <View style={styles.handleContainer}>
              {!noHandle && <View style={styles.handle} />}
            </View>
          </GestureDetector>
          <View style={{ flex: 1 }}>{children}</View>
        </Animated.View>
      </Portal>
    )
  },
)

const styles = StyleSheet.create({
  permanentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  container: {
    backgroundColor: 'white',
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
