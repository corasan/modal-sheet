import { PropsWithChildren } from 'react'
import { ModalSheetInternalProvider } from './ModalSheetInternalProvider'
import { ModalSheetExternalProvider } from './ModalSheetExternalProvider'

export function ModalSheetProvider({ children }: PropsWithChildren) {
  return (
    <ModalSheetInternalProvider>
      <ModalSheetExternalProvider>{children}</ModalSheetExternalProvider>
    </ModalSheetInternalProvider>
  )
}
