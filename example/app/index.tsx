import { ModalSheet, ModalSheetStack } from '@corasan/modal-sheet'
import { ModalSheetRef, ModalSheetStackRef } from '@corasan/modal-sheet/types'
import { useRef } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Accordion } from './Accordion'
import { YStack } from 'tamagui'

export default function App() {
  const modal1 = useRef<ModalSheetRef>(null)
  const modal2 = useRef<ModalSheetStackRef>(null)
  const modal3 = useRef<ModalSheetRef>(null)
  const modal4 = useRef<ModalSheetStackRef>(null)
  const modal5 = useRef<ModalSheetStackRef>(null)

  return (
    <View style={styles.container}>
      <Button
        title="Modal 1 - expand()"
        onPress={() => {
          modal1.current?.expand()
        }}
      />
      <Button
        title="Modal 2 - open()"
        onPress={() => {
          modal2.current?.open()
        }}
      />

      <ModalSheet name="modal1" ref={modal1} offset={65}>
        <View>
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
          height: 65,
          backgroundColor: 'navy',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <ModalSheet name="modal3" ref={modal3} offset={65}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 3</Text>
            </View>
            <YStack borderWidth={1} height={120} width="100%" />
            <View>
              <Accordion>
                <YStack backgroundColor="red" height={200} width="100%"></YStack>
              </Accordion>
            </View>
          </View>
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
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between', paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 2</Text>
          </View>
          <View>
            <Button
              title="Open Modal 4"
              onPress={() => {
                modal4.current?.open()
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
        name="modal4"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal4}
      >
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between', paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 4</Text>
          </View>
          <View>
            <Button
              title="Open Modal 5"
              onPress={() => {
                modal5.current?.open()
              }}
            />
          <Button
            title="Dismiss Modal"
            onPress={() => {
              modal4.current?.dismiss()
            }}
          />
          </View>
        </View>
      </ModalSheetStack>
      <ModalSheetStack
        name="modal5"
        backdropColor="white"
        backdropOpacity={0.5}
        ref={modal5}
      >
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'space-between', paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '500', fontSize: 18 }}>Modal 5</Text>
          </View>
          <View>
          <Button
            title="Dismiss Modal"
            onPress={() => {
              modal5.current?.dismiss()
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
