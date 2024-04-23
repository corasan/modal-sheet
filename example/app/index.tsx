import { ModalSheet } from '@corasan/modal-sheet'
import { ModalSheetRef } from '@corasan/modal-sheet/types'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'

const HEIGHT = Dimensions.get('window').height
const SWIPE_VELOCITY_THRESHOLD = 1500

export default function App() {
  const router = useRouter()
  const modal1 = useRef<ModalSheetRef>()
  const modal2 = useRef<ModalSheetRef>()
  const modal3 = useRef<ModalSheetRef>()
  const minHeight = useRef(HEIGHT - 200).current

  const onGestureEnd = (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    const { velocityY, absoluteY, translationY } = event
    if (translationY > 0) {
      if (absoluteY < minHeight && velocityY > SWIPE_VELOCITY_THRESHOLD) {
        modal1.current?.minimize()
      } else if (absoluteY < HEIGHT / 2 && translationY > 80) {
        modal1.current?.minimize(HEIGHT / 2)
      } else if (absoluteY > HEIGHT / 2) {
        modal1.current?.minimize()
      } else {
        modal1.current?.expand(undefined, false)
      }
    } else {
      if (velocityY < -SWIPE_VELOCITY_THRESHOLD) {
        modal1.current?.expand(undefined, false)
      } else if (absoluteY > HEIGHT / 2 && translationY < -80) {
        modal1.current?.expand(HEIGHT / 2, true)
      } else if (absoluteY < HEIGHT / 2) {
        modal1.current?.expand(undefined, false)
      } else {
        modal1.current?.minimize()
      }
    }
  }

  return (
    <View style={styles.container}>
      <Button
        title="Go to Page 1"
        onPress={() => {
          router.push('page1')
        }}
      />
      <Button
        title="Modal 1 - open()"
        onPress={() => {
          modal1.current?.open()
        }}
      />
      <Button
        title="Modal 1 - expand()"
        onPress={() => {
          modal1.current?.expand()
        }}
      />
      <Button
        title="Modal 1 - expand(HEIGHT / 2)"
        onPress={() => {
          modal1.current?.expand(HEIGHT / 2)
        }}
      />

      <ModalSheet
        name="modal1"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal1}
        minimizedHeight={250}
        onGestureEnd={onGestureEnd}
      >
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 1</Text>
          </View>
          <Button
            title="Open Modal 2"
            onPress={() => {
              modal2.current?.open()
            }}
          />
          <Button
            title="Dismiss Modal"
            onPress={() => {
              modal1.current?.dismiss()
            }}
          />
        </View>
      </ModalSheet>
      <View
        style={{
          height: 70,
          backgroundColor: 'red',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />

      <ModalSheet name="modal2" backdropColor="white" backdropOpacity={0.5} ref={modal2}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 2</Text>
          </View>
          <Button
            title="Open Modal 3"
            onPress={() => {
              modal3.current?.open()
            }}
          />
          <Button
            title="Dismiss Modal"
            onPress={() => {
              modal2.current?.dismiss()
            }}
          />
        </View>
      </ModalSheet>
      <ModalSheet name="modal3" backdropColor="white" backdropOpacity={0.5} ref={modal3}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 3</Text>
          </View>
          <Button
            title="Dismiss Modal"
            onPress={() => {
              modal3.current?.dismiss()
            }}
          />
        </View>
      </ModalSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
