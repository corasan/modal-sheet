import React from 'react'

export const ModalSheetChild = ({ children, onLayoutChange }) => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        // @ts-ignore
        onLayout: (event) => {
          // @ts-ignore
          if (child.props.onLayout) {
            // @ts-ignore
            child.props.onLayout(event)
          }
          onLayoutChange(event)
        },
      })
    }
    return child
  })
}
