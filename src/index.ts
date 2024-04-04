import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReactNativeModalSheet.web.ts
// and on native platforms to ReactNativeModalSheet.ts
import ReactNativeModalSheetModule from './ReactNativeModalSheetModule';
import ReactNativeModalSheetView from './ReactNativeModalSheetView';
import { ChangeEventPayload, ReactNativeModalSheetViewProps } from './ReactNativeModalSheet.types';

// Get the native constant value.
export const PI = ReactNativeModalSheetModule.PI;

export function hello(): string {
  return ReactNativeModalSheetModule.hello();
}

export async function setValueAsync(value: string) {
  return await ReactNativeModalSheetModule.setValueAsync(value);
}

const emitter = new EventEmitter(ReactNativeModalSheetModule ?? NativeModulesProxy.ReactNativeModalSheet);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ReactNativeModalSheetView, ReactNativeModalSheetViewProps, ChangeEventPayload };
