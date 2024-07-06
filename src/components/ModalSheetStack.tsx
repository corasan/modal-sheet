import { Portal } from '@gorhom/portal'
import { PropsWithChildren, forwardRef, useEffect, useImperativeHandle } from 'react'
import { View, StyleSheet } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
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
    { name, noHandle = false, children, onDismiss, enableDragToDismiss = true, ...props },
    ref,
  ) => {
    const {
      registerModal,
      addModalToStack,
      removeModalFromStack,
      activeIndex,
      updateY,
      currentModal,
      modalStack,
      previousModal,
    } = useInternal()
    const {
      MODAL_SHEET_HEIGHT,
      SCREEN_HEIGHT,
      ANIMATE_BORDER_RADIUS,
      DEFAULT_BORDER_RADIUS,
      TOP_INSET_HEIGHT,
      CHILDREN_Y_POSITION,
    } = useConstants()
    const modalHeight = useSharedValue(MODAL_SHEET_HEIGHT)
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const scale = useSharedValue(1)
    const borderRadius = useSharedValue(40)
    const showBackdrop = useSharedValue(0)
    const prevGestureTouchY = useSharedValue(0)
    const gesture = Gesture.Pan()
      .onBegin((e) => {
        prevGestureTouchY.value = e.absoluteY
      })
      .onUpdate((e) => {
        if (e.absoluteY < TOP_INSET_HEIGHT + 24) {
          modalHeight.value = animateOpen(MODAL_SHEET_HEIGHT + 8)
          return
        }
        if (!enableDragToDismiss) {
          modalHeight.value = animateOpen(MODAL_SHEET_HEIGHT - 8)
          return
        }
        const moveVal = e.absoluteY - prevGestureTouchY.value
        translateY.value = moveVal

        if (activeIndex.value === 0) {
          const y = interpolateClamp(
            moveVal,
            [0, SCREEN_HEIGHT],
            [CHILDREN_Y_POSITION, 0],
          )
          updateY(y)
        }

        // Animate the previous modal based on current modal gesture
        if (previousModal.value) {
          const prev = previousModal.value
          prev.translateY.value = interpolateClamp(moveVal, [0, SCREEN_HEIGHT], [-12, 0])
          prev.scale.value = interpolateClamp(moveVal, [0, SCREEN_HEIGHT], [0.92, 1])
          prev.borderRadius.value = interpolateClamp(
            moveVal,
            [0, SCREEN_HEIGHT],
            [ANIMATE_BORDER_RADIUS, DEFAULT_BORDER_RADIUS],
          )
        }
      })
      .onEnd((e) => {
        modalHeight.value = animateClose(MODAL_SHEET_HEIGHT)
        if (!enableDragToDismiss) {
          return
        }
        if (e.translationY < 150) {
          translateY.value = animateOpen(0)
          showBackdrop.value = animateOpen(1)
          if (e.absoluteY < CHILDREN_Y_POSITION) {
            return
          }
        } else {
          translateY.value = animateClose(SCREEN_HEIGHT)
          showBackdrop.value = animateClose(0)
          runOnJS(removeModalFromStack)(name)
          if (onDismiss) {
            runOnJS(onDismiss)()
          }
        }
      })
    const modalStyle = useAnimatedStyle(() => {
      return {
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [0, 10]),
        borderTopLeftRadius: borderRadius.value,
        borderTopRightRadius: borderRadius.value,
        height: modalHeight.value,
        transform: [
          {
            scaleX: scale.value,
          },
          {
            translateY: translateY.value,
          },
        ],
      }
    })

    useAnimatedReaction(
      () => currentModal.value,
      (modal, prevModal) => {
        if (modal) {
          modal.translateY.value = animateOpen(0)
          modal.scale.value = animateOpen(1)
          modal.borderRadius.value = animateOpen(DEFAULT_BORDER_RADIUS)
          modal.showBackdrop.value = animateOpen(1)
          let prevPrevModal = modalStack[activeIndex.value - 2]
          if (!prevModal) {
            updateY(animateOpen(CHILDREN_Y_POSITION))
          }

          if (prevModal && modalStack.filter((m) => m.id === prevModal.id).length === 0) {
            // When removing the current modal, animate the previous modal to it's closed position
            // In this case, the previous modal is the one being closed
            prevPrevModal = modalStack[activeIndex.value - 1]
            prevModal.translateY.value = animateClose(SCREEN_HEIGHT)
            prevModal.showBackdrop.value = animateClose(0)
            prevModal.scale.value = animateClose(1)
            prevModal.borderRadius.value = animateClose(ANIMATE_BORDER_RADIUS)
            if (modalStack.length === 1) {
              // When there's only one modal left, animate the children to the stacked behind position
              updateY(animateOpen(CHILDREN_Y_POSITION))
            }
            if (prevPrevModal) {
              // When removing the current modal, animate the previous modal to the stacked behind position
              prevPrevModal.translateY.value = animateClose(-12)
            }
            return
          } else if (prevModal) {
            // When adding modals to the stack, animate the previous modal to the stacked behind position
            prevModal.translateY.value = animateClose(-12)
            prevModal.scale.value = animateClose(0.92)
            prevModal.borderRadius.value = animateClose(ANIMATE_BORDER_RADIUS)
            prevModal.showBackdrop.value = animateClose(0)
            if (prevPrevModal) {
              // When there are multiple modals in the stack, animate the further modal below the previous modal
              prevPrevModal.translateY.value = animateClose(12)
            } else {
              // When there's only one modal in the stack, animate the children to the further below the previous modal
              updateY(animateClose(CHILDREN_Y_POSITION + 12))
            }
          }
        }
        if (!modal && prevModal) {
          updateY(animateClose(0))
        }
      },
    )

    const open = () => {
      addModalToStack(name)
    }

    const dismiss = () => {
      onDismiss?.()
      removeModalFromStack(name)
    }

    useImperativeHandle(ref, () => ({
      open,
      dismiss,
      id: name,
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

    return (
      <Portal hostName="modalSheetStack">
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
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
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
