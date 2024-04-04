import { StyleSheet, Text, View } from 'react-native';

import * as ReactNativeModalSheet from 'react-native-modal-sheet';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeModalSheet.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
