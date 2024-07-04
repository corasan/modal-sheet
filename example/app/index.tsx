import { ModalSheetStack } from '@corasan/modal-sheet'
import { ModalSheetStackRef } from '@corasan/modal-sheet/types'
import { useRef } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

export default function App() {
  const modal1 = useRef<ModalSheetStackRef>(null)
  const modal2 = useRef<ModalSheetStackRef>(null)
  const modal3 = useRef<ModalSheetStackRef>(null)

  return (
    <View style={styles.container}>
      <Button
        title="Modal 1 - open()"
        onPress={() => {
          modal2.current?.open()
        }}
      />
      <ModalSheetStack
        name="modal1"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal2}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            paddingBottom: 30,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 1</Text>
          </View>
          <View>
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
        </View>
      </ModalSheetStack>
      <ModalSheetStack
        name="modal2"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal2}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            paddingBottom: 30,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 2</Text>
          </View>
          <View>
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
        </View>
      </ModalSheetStack>
      <ModalSheetStack
        name="modal5"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal3}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            paddingBottom: 30,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 3</Text>
          </View>
          <View>
            <Button
              title="Dismiss Modal"
              onPress={() => {
                modal3.current?.dismiss()
              }}
            />
          </View>
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
