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
| minimumHeight | number | - | The minimum height the modal can be minized | No |
| onGestureEnd | (e: PanGestureHandlerEventPayload) => void| - | Custom callback when the gesture ends | No |

## Methods

### useModalSheet

| Name | Type | Description |
| --- | --- | --- |
| open | () => void | Open the modal sheet |
| dismiss | () => void | Dismiss the modal sheet |
| extend | (height?: number, disableSheetStack?: boolean) => void | Extend to custom height |
| minimize | (height?: number, disableSheetStack?: boolean) => void | Minimize to custom height |
