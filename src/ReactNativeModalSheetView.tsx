import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ReactNativeModalSheetViewProps } from './ReactNativeModalSheet.types';

const NativeView: React.ComponentType<ReactNativeModalSheetViewProps> =
  requireNativeViewManager('ReactNativeModalSheet');

export default function ReactNativeModalSheetView(props: ReactNativeModalSheetViewProps) {
  return <NativeView {...props} />;
}
