import { useRef, isValidElement, cloneElement, Children } from 'react'

export const ModalSheetChild = ({ children, onLayoutChange }) => {
  const initialHeightRef = useRef(0)
  return Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        // @ts-ignore
        onLayout: (event) => {
          const { height } = event.nativeEvent.layout
          if (initialHeightRef.current === 0) {
            initialHeightRef.current = height
          }
          onLayoutChange(height, initialHeightRef.current)

          // @ts-ignore
          if (child.props.onLayout) {
            // @ts-ignore
            child.props.onLayout(event)
          }
        },
      })
    }
    return child
  })
}
