import React from 'react'

const Button = ({
    children,
    type = 'button',
    className = '',
    bgColor = 'bg-blue-600',
    textColor ="text-white",
    ...props
}) => {
  return (
    <button 
    className={` ${className} ${bgColor} ${textColor} inline-block px-6 font-semibold py-2 duration-200 hover:bg-blue-100 hover:text-black rounded-full`}{...props}>
    {children}
    </button>
  )
}

export default Button