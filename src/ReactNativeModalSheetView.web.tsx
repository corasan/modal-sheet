import * as React from 'react';

import { ReactNativeModalSheetViewProps } from './ReactNativeModalSheet.types';

export default function ReactNativeModalSheetView(props: ReactNativeModalSheetViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
