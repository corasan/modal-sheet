import { PropsWithChildren, useCallback, useContext } from 'react'
import { ModalSheetContext } from './Context'
import { ModalSheetInternalContext } from './InternalContext'

export function ModalSheetExternalProvider({ children }: PropsWithChildren) {
  return <ModalSheetContext.Provider value={null}>{children}</ModalSheetContext.Provider>
}
