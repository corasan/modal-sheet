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
      modalStack,
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
          modalHeight.value = animateOpen(MODAL_SHEET_HEIGHT + 6)
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
      })
      .onEnd((e) => {
        modalHeight.value = animateClose(MODAL_SHEET_HEIGHT)
        if (e.translationY < 80) {
          translateY.value = animateOpen(0)
          showBackdrop.value = animateOpen(1)
          if (e.absoluteY < CHILDREN_Y_POSITION) {
            return
          }
          if (activeIndex.value === 0) {
            updateY(animateOpen(0))
          }
        } else {
          translateY.value = animateClose(SCREEN_HEIGHT)
          showBackdrop.value = animateClose(0)
          updateY(animateClose(0))
          runOnJS(removeModalFromStack)(name)
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
          if (!prevModal) {
            updateY(animateOpen(CHILDREN_Y_POSITION))
          }

          if (prevModal && modalStack.filter((m) => m.id === prevModal.id).length === 0) {
            prevModal.translateY.value = animateClose(SCREEN_HEIGHT)
            prevModal.showBackdrop.value = animateClose(0)
            prevModal.scale.value = animateClose(1)
            prevModal.borderRadius.value = animateClose(ANIMATE_BORDER_RADIUS)
            updateY(animateOpen(CHILDREN_Y_POSITION))
            return
          } else if (prevModal) {
            prevModal.translateY.value = animateClose(-12)
            prevModal.scale.value = animateClose(0.92)
            prevModal.borderRadius.value = animateClose(ANIMATE_BORDER_RADIUS)
            prevModal.showBackdrop.value = animateClose(0)
            updateY(animateClose(CHILDREN_Y_POSITION + 12))
          }
        }
        if (!modal && prevModal) {
          updateY(animateClose(0))
        }
      },
    )

    const open = () => {
      'worklet'
      addModalToStack(name)
    }

    const dismiss = () => {
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
