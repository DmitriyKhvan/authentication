import React from 'react';

const Button = (props) => {
 
  const cls = [
    'btn',
    `btn-${props.type}`
  ]

  return (
    <button
      type="button"
      className={cls.join(' ')}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

export default Button;