import React, { useRef } from 'react'

export const ModalSheetChild = ({ children, onLayoutChange }) => {
  const initialHeightRef = useRef(0)
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
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
