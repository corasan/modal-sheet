> [!WARNING]
> This package is still in development and not fully featured yet. Please use with caution.

## Installation

```bash
npm install @corasan/modal-sheet
yarn add @corasan/modal-sheet
bun add @corasan/modal-sheet
```

## Usage

First, wrap your application with the `ModalSheetProvider` component.

```tsx
import { ModalSheetProvider } from '@corasan/modal-sheet';

function App() {
  return (
    <ModalSheetProvider>
      <YourApp />
    </ModalSheetProvider>
  );
}
```

Use `useModalSheet` hook to open and close the modal sheet.

```tsx
import { useModalSheet } from '@corasan/modal-sheet';

function YourComponent() {
  const { open, dismiss } = useModalSheet();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Butto title="Open Modal Sheet" onClick={() => open())} />

      <ModalSheet>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ fontWeight: "500", fontSize: 18 }}>Title</Text>
          </View>

          <View
            style={{
              paddingVertical: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              title="Close Modal"
              onPress={() => {
                dismiss();
              }}
            />
          </View>
        </View>
      </ModalSheet>
    </View>
  );
}
```

## Props

### ModalSheet

| Name | Type | Default  | Description | Required |
| --- | --- | --- | --- | --- |
| children | ReactNode | - | The children components | Kinda |
| containerStyle | string | - | Styles for the modal sheet container | No |
| noHandle | boolean | false | Hide the handle | No |
| minimizedHeight | number | - | The minimum height the modal can be minized | No |
| disableSheetStackEffect | boolean | - | Disable sheet stack effect | No |
| onGestureUpdate | (e: GestureUpdateEvent\<PanGestureHandlerEventPayload>) => void| - | Custom callback to handle gesture updates | No |
| onGestureBegin | (e: GestureStateChangeEvent\<PanGestureHandlerEventPayload>) => void| - | Custom callback to handle on gesture begin | No |
| onGestureEnd | (e: GestureStateChangeEvent\<PanGestureHandlerEventPayload>) => void| - | Custom callback to handle on gesture end | No |
| onGestureStart | (e: GestureStateChangeEvent\<PanGestureHandlerEventPayload>) => void| - | Custom callback to handle on gesture start | No |
| onGestureFinalize | (e: GestureStateChangeEvent\<PanGestureHandlerEventPayload>) => void| - | Custom callback to handle on gesture finalize | No |
| onGestureTouchesDown | (e: GestureTouchEvent) => void| - | Custom callback to handle on gesture touch down | No |
| onGestureTouchesUp | (e: GestureTouchEvent) => void| - | Custom callback to handle on gesture touch up | No |
| onGestureTouchesMove | (e: GestureTouchEvent) => void| - | Custom callback to handle on gesture touch move | No |
| onGestureTouchesCancelled | (e: GestureTouchEvent) => void| - | Custom callback to handle on gesture touch cancelled | No |

## Hooks

### useModalSheet

> [!WARNING]
> This is a work in progress and not yet fully implemented/functional

| Name | Type | Description |
| --- | --- | --- |
| open | () => void | Open the modal sheet |
| dismiss | () => void | Dismiss the modal sheet |
| expand | (height?: number, disableSheetStack?: boolean) => void | expand to custom height |
| minimize | (height?: number) => void | Minimize to custom height |
