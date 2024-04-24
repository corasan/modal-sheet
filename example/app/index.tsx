import { ModalSheet, ModalSheetStack } from '@corasan/modal-sheet'
import { ModalSheetRef, ModalSheetStackRef } from '@corasan/modal-sheet/types'
import { useRef } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

export default function App() {
  const modal1 = useRef<ModalSheetRef>(null)
  const modal2 = useRef<ModalSheetStackRef>(null)
  const modal3 = useRef<ModalSheetRef>(null)

  return (
    <View style={styles.container}>
      <Button
        title="Modal 1 - expand()"
        onPress={() => {
          modal1.current?.expand()
        }}
      />
      <Button
        title="Modal 1 - expand(full: true)"
        onPress={() => {
          modal1.current?.expand('full')
        }}
      />

      <ModalSheet name="modal1" ref={modal1} offset={70}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 1</Text>
          </View>
          <Button
            title="Expand Modal 1 again"
            onPress={() => {
              modal1.current?.expand()
            }}
          />
          <Button
            title="Modal 3 - expand(full: true)"
            onPress={() => {
              modal3.current?.expand('full')
            }}
          />
          <Button
            title="Open Modal 2"
            onPress={() => {
              modal2.current?.open()
            }}
          />
          <Button
            title="Dismiss Modal"
            onPress={() => {
              modal1.current?.minimize()
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
      <ModalSheet name="modal3" ref={modal3} offset={70}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 3</Text>
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
              modal3.current?.minimize()
            }}
          />
        </View>
      </ModalSheet>

      <ModalSheetStack
        name="modal2"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal2}
      >
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 2</Text>
          </View>
          <Button
            title="Dismiss Modal"
            onPress={() => {
              modal2.current?.dismiss()
            }}
          />
        </View>
      </ModalSheetStack>
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
