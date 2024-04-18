export interface ModalSheetRef {
  open: () => void
  dismiss: () => void
  translateY: SharedValue<number>
  id: string
  index: number
  modalHeight: SharedValue<number>
  [key: string]: any
}
