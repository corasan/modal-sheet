import { ModalSheet } from '@corasan/modal-sheet'
import { useRef } from 'react'
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'

const HEIGHT = Dimensions.get('window').height

export default function App() {
  const modal1 = useRef()
  const modal2 = useRef()
  const modal3 = useRef()

  return (
    <View style={styles.container}>
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
          modal1.current?.expand(HEIGHT / 3)
        }}
      />
      <ModalSheet
        name="modal1"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal1}
        minimizedHeight={250}
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
