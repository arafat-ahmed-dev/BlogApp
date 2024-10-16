import React, {useId} from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const id = useId()
    return(
        <div className="mb-4">
            {label && <label htmlFor={id} className="inline-blockblock text-sm font-bold mb-2">
                {label}
            </label>}
            <input
                ref={ref}
                type={type}
                className={`w-full shadow border rounded-lg py-2 px-3 outline-none border-gray-200 text-black leading-tight focus:bg-gray-200 focus:shadow-outline ${className}`}
                {...props}
                id={id}
            />
        </div>
    )
})

export default Input