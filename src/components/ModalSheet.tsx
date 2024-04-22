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
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { animateClose, animateOpen, interpolateClamp, useConstants } from '../utils'
import { ModalSheetProps } from '../types'
import { useInternal } from '../hooks/useInternal'

export const ModalSheet = forwardRef<
  typeof ModalSheet,
  PropsWithChildren<ModalSheetProps>
>(
  (
    {
      name,
      noHandle = false,
      backdropColor,
      backdropOpacity,
      minimizedHeight,
      children,
      ...props
    },
    ref,
  ) => {
    const {
      registerModal,
      addModalToStack,
      removeModalFromStack,
      activeIndex,
      modalStack,
      disableSheetStackEffect,
      minimumHeight,
      backdropColor: bckdropColor,
      backdropOpacity: bckdropOpacity,
      updateModalHeight,
    } = useInternal()
    const { MAX_HEIGHT, MODAL_SHEET_HEIGHT, HEADER_HEIGHT, SCREEN_HEIGHT } =
      useConstants()
    const modalHeight = useSharedValue(0)
    const dismissHeight = useDerivedValue(() => (!minimizedHeight ? 0 : minimizedHeight))
    const scaleX = useSharedValue(1)
    const borderRadius = useSharedValue(40)
    const showBackdrop = useSharedValue(0)
    const [shouldTeleport, setShouldTeleport] = useState(true)
    const gesture = Gesture.Pan()
      .onBegin((e) => props.onGestureBegin?.(e))
      .onStart((e) => props.onGestureStarts?.(e))
      .onFinalize((e) => props.onGestureFinalize?.(e))
      .onTouchesDown((e) => {
        if (props.onGestureTouchesDown) {
          runOnJS(props.onGestureTouchesDown)(e)
        }
      })
      .onTouchesUp((e) => props.onGestureTouchesUp?.(e))
      .onTouchesMove((e) => props.onGestureTouchesMove?.(e))
      .onTouchesCancelled((e) => props.onGestureTouchesCancelled?.(e))
      .onUpdate((e) => {
        if (props.onGestureUpdate) {
          props.onGestureUpdate(e)
          return
        }
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
            [dismissHeight.value, MODAL_SHEET_HEIGHT],
            [1, 0.96],
          )
        }
      })
      .onEnd((e) => {
        if (props.onGestureEnd) {
          runOnJS(props.onGestureEnd)(e)
          return
        }
        if (e.translationY < 0) {
          modalHeight.value = animateOpen(MODAL_SHEET_HEIGHT)
          showBackdrop.value = animateOpen(1)
          if (activeIndex.value === 0) {
            updateModalHeight(animateOpen(MODAL_SHEET_HEIGHT))
          }
          runOnJS(addModalToStack)(name)
        } else {
          modalHeight.value = animateClose(dismissHeight.value)
          showBackdrop.value = animateClose(0)
          updateModalHeight(animateClose(dismissHeight.value))
          runOnJS(removeModalFromStack)(name)
        }
      })

    const modalStyle = useAnimatedStyle(() => {
      return {
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [1, 99]),
        borderRadius: borderRadius.value,
        height: modalHeight.value,
        transform: [
          {
            scaleX: scaleX.value,
          },
        ],
      }
    })
    const shadowStyle = useAnimatedStyle(() => {
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: interpolateClamp(
          modalHeight.value,
          [0, minimumHeight.value],
          [0, 0.08],
        ),
        shadowRadius: 8,
        backdropColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }
    })
    const backdropStyles = useAnimatedStyle(() => {
      return {
        opacity: interpolateClamp(showBackdrop.value, [0, 1], [0, 0.3]),
        zIndex: interpolateClamp(showBackdrop.value, [0, 1], [-1, 0]),
      }
    })

    const open = () => {
      setShouldTeleport(true)
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
      modalHeight.value = animateClose(dismissHeight.value)
      showBackdrop.value = animateClose(0)
      if (activeIndex.value === 1) {
        updateModalHeight(animateClose(dismissHeight.value))
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
      if (minimizedHeight !== undefined) {
        setTimeout(() => setShouldTeleport(false), 1000)
      }
      removeModalFromStack(name)
    }

    // This function is used to expand the modal to a specific height
    // If the height is not provided, the modal will expand to its maximum height
    const expand = useCallback((height?: number, disableSheetEffect?: boolean) => {
      'worklet'
      setShouldTeleport(true)
      showBackdrop.value = animateOpen(activeIndex.value + 1)
      if (disableSheetEffect !== undefined) {
        disableSheetStackEffect.value = disableSheetEffect ? 1 : 0
      }
      if (height) {
        modalHeight.value = animateOpen(height)
        return
      }
      disableSheetStackEffect.value = 0
      open()
    }, [])

    // This function is used to minimize the modal to a specific height
    // If the height is not provided, the modal will minimize to its minimized height
    const minimize = useCallback((height?: number) => {
      'worklet'
      setShouldTeleport(false)
      showBackdrop.value = animateClose(0)
      if (disableSheetStackEffect.value) {
        disableSheetStackEffect.value = 0
      }
      if (height) {
        modalHeight.value = animateClose(height)
        return
      }
      setShouldTeleport(true)
      dismiss()
    }, [])

    const setDisableSheetStackEffect = useCallback((value: 1 | 0) => {
      disableSheetStackEffect.value = value
    }, [])

    useImperativeHandle(ref, () => ({
      open,
      dismiss,
      scaleX,
      borderRadius,
      minimizedHeight,
      id: name,
      expand,
      minimize,
      setDisableSheetStackEffect,
      modalHeight,
      showBackdrop,
    }))

    useEffect(() => {
      // Register the modal with the context
      if (ref && 'current' in ref && ref.current) {
        registerModal(name, ref.current)
      }
    }, [name, ref])

    useEffect(() => {
      disableSheetStackEffect.value = props.disableSheetStackEffect ? 1 : 0
      if (backdropColor && backdropColor !== 'black') {
        bckdropColor.value = backdropColor
      }
      if (backdropOpacity && backdropOpacity !== 0.4) {
        bckdropOpacity.value = backdropOpacity
      }
      if (minimizedHeight) {
        setShouldTeleport(false)
        minimumHeight.value = minimizedHeight
        modalHeight.value = animateOpen(minimizedHeight)
      }
    }, [backdropOpacity, backdropOpacity, minimizedHeight, props.disableSheetStackEffect])

    return (
      <>
        {!shouldTeleport ? (
          <>
            <Animated.View style={[shadowStyle]}>
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
            </Animated.View>
          </>
        ) : (
          <Portal hostName="modalSheet">
            <Animated.View style={[styles.backdrop, backdropStyles]} />
            <Animated.View style={[shadowStyle]}>
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
            </Animated.View>
          </Portal>
        )}
      </>
    )
  },
)

const styles = StyleSheet.create({
  permanentContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 40,
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
