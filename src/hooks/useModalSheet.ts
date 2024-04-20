import { useContext } from 'react'
import { ModalSheetContext } from '../Providers/Context'

// WIP
export function useModalSheet() {
  const context = useContext(ModalSheetContext)
  if (!context) {
    throw new Error('useModalSheet must be used within a ModalSheetProvider')
  }

  const { open, expand, dismiss } = context
  return {
    open,
    expand,
    dismiss,
  }
}
