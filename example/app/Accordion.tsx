import { YStack, Paragraph, Square, Text } from 'tamagui'
import Animated, {
  interpolate,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { PropsWithChildren, useState } from 'react'
import { TouchableOpacity } from 'react-native'

export function Accordion({ children }: PropsWithChildren) {
  const [layoutHeight, setLayoutHeight] = useState(0)
  const height = useSharedValue(0)
  const open = useSharedValue(false)
  const transition = useDerivedValue(() => (open.value ? withTiming(1) : withTiming(0)))
  const animatedStyle = useAnimatedStyle(() => ({
    height: 1 + transition.value * height.value,
    opacity: interpolate(transition.value, [0, 1], [0, 1]),
  }))

  return (
    <TouchableOpacity
      onPress={() => {
        if (height.value === 0) {
          runOnUI(() => {
            'worklet'
            height.value = layoutHeight
          })()
        }
        open.value = !open.value
      }}
    >
      <Text color="black" fontSize={16}>
        Accordion
      </Text>

      <Animated.View
        style={[
          animatedStyle,
          {
            overflow: 'hidden',
          },
        ]}
      >
        <YStack
          onLayout={({ nativeEvent }) => {
            setLayoutHeight(nativeEvent.layout.height)
          }}
          justifyContent="flex-start"
          padding={0}
          // position="absolute"
          // right={0}
          // left={0}
          gap={12}
        >
          {children}
        </YStack>
      </Animated.View>
    </TouchableOpacity>
  )
}
