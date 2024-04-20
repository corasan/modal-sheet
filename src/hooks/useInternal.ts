import { useContext } from 'react'
import { ModalSheetInternalContext } from '../Providers/InternalContext'

export function useInternal() {
  const context = useContext(ModalSheetInternalContext)
  if (!context) {
    throw new Error('useInternal must be used within a ModalSheetProvider')
  }

  return context
}
