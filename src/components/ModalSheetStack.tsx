import { Portal } from '@gorhom/portal'
import { PropsWithChildren, forwardRef, useEffect, useImperativeHandle } from 'react'
import { View, StyleSheet } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
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
      modalStack,
      disableSheetStackEffect,
      backdropColor: bckdropColor,
      backdropOpacity: bckdropOpacity,
      updateModalHeight,
    } = useInternal()
    const { MAX_HEIGHT, MODAL_SHEET_HEIGHT, HEADER_HEIGHT, SCREEN_HEIGHT } =
      useConstants()
    const modalHeight = useSharedValue(0)
    const scaleX = useSharedValue(1)
    const borderRadius = useSharedValue(40)
    const showBackdrop = useSharedValue(0)
    const gesture = Gesture.Pan()
      .onUpdate((e) => {
        if (activeIndex.value > 0 && e.absoluteY <= HEADER_HEIGHT) {
          return
        } else if (activeIndex.value <= 0 && e.absoluteY < HEADER_HEIGHT + 10) {
          return
        }
        const moveVal = SCREEN_HEIGHT - e.absoluteY
        modalHeight.value = moveVal
        if (!disableSheetStackEffect.value && activeIndex.value === 1) {
          updateModalHeight(SCREEN_HEIGHT - e.absoluteY)
        }
        // Animate the modal behind if there is a stack of modals
        // When the current modal is dragged, the modal behind animates with it
        const behindModalRef = modalStack[activeIndex.value - 1]
        if (behindModalRef) {
          const val = interpolateClamp(
            moveVal,
            [0, MODAL_SHEET_HEIGHT],
            [MODAL_SHEET_HEIGHT, MAX_HEIGHT + 5],
          )
          behindModalRef.modalHeight.value = val
          behindModalRef.scaleX.value = interpolateClamp(
            moveVal,
            [0, MODAL_SHEET_HEIGHT],
            [1, 0.96],
          )
        }
      })
      .onEnd((e) => {
        if (e.translationY < 0) {
          modalHeight.value = animateOpen(MODAL_SHEET_HEIGHT)
          showBackdrop.value = animateOpen(1)
          if (activeIndex.value === 0) {
            updateModalHeight(animateOpen(MODAL_SHEET_HEIGHT))
          }
          runOnJS(addModalToStack)(name)
        } else {
          modalHeight.value = animateClose(0)
          showBackdrop.value = animateClose(0)
          updateModalHeight(animateClose(0))
          runOnJS(removeModalFromStack)(name)
        }
      })

    const modalStyle = useAnimatedStyle(() => {
      return {
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [1, 99]),
        borderTopLeftRadius: borderRadius.value,
        borderTopRightRadius: borderRadius.value,
        height: modalHeight.value,
        transform: [
          {
            scaleX: scaleX.value,
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

    const open = () => {
      disableSheetStackEffect.value = 0
      modalHeight.value = animateOpen(MODAL_SHEET_HEIGHT)
      showBackdrop.value = animateOpen(1)
      if (activeIndex.value === 0) {
        // If there is no modal in the stack, update the modal height
        // This value is used to animate the app container when the modal is opened
        updateModalHeight(animateOpen(MODAL_SHEET_HEIGHT))
      }
      addModalToStack(name)
      // Animate the modal behind if there is a stack of modals
      // When a new modal is opened, the previous modal should be moved to the back
      const behindModalRef = modalStack[activeIndex.value]
      if (behindModalRef) {
        behindModalRef.modalHeight.value = animateClose(MAX_HEIGHT + 5)
        behindModalRef.scaleX.value = animateClose(0.96)
        behindModalRef.borderRadius.value = animateClose(24)
        behindModalRef.showBackdrop.value = animateClose(0)
      }
    }

    const dismiss = () => {
      modalHeight.value = animateClose(0)
      showBackdrop.value = animateClose(0)
      if (activeIndex.value === 1) {
        updateModalHeight(animateClose(0))
      }
      // Animate the modal behind if there is a stack of modals
      // When the modal is dismissed, the modal behind should be moved to the top
      const behindModalRef = modalStack[activeIndex.value - 1]
      if (behindModalRef) {
        behindModalRef.modalHeight.value = animateClose(MODAL_SHEET_HEIGHT)
        behindModalRef.scaleX.value = animateClose(1)
        behindModalRef.borderRadius.value = animateClose(40)
        behindModalRef.showBackdrop.value = animateClose(1)
      }
      removeModalFromStack(name)
    }

    useImperativeHandle(ref, () => ({
      open,
      dismiss,
      id: name,
      modalHeight,
      scaleX,
      borderRadius,
      showBackdrop,
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
      <Portal hostName="modalSheet">
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
