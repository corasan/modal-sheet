import { createContext } from 'react'
import { ModalSheetContextType } from '..'

// WIP
export const ModalSheetContext = createContext<ModalSheetContextType>({
  expand: () => {},
  open: () => {},
  dismiss: () => {},
  updateModalHeight: () => {},
})
