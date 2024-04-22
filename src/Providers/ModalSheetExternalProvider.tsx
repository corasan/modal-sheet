import { PropsWithChildren } from 'react'
import { ModalSheetContext } from './Context'

export function ModalSheetExternalProvider({ children }: PropsWithChildren) {
  return <ModalSheetContext.Provider value={null}>{children}</ModalSheetContext.Provider>
}
