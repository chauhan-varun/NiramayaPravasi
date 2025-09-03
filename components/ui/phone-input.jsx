'use client'

import React from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './phone-input.css'
import { cn } from '@/lib/utils'

const PhoneNumberInput = React.forwardRef(({ className, value, onChange, placeholder, error, size = "default", ...props }, ref) => {
  return (
    <PhoneInput
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Enter phone number"}
      defaultCountry="IN"
      international
      countryCallingCodeEditable={false}
      className={cn(
        "phone-input-container",
        size === "sm" && "sm",
        size === "lg" && "lg",
        error && "error",
        className
      )}
      numberInputProps={{
        className: "phone-number-input"
      }}
      countrySelectProps={{
        className: "country-select"
      }}
      {...props}
    />
  )
})

PhoneNumberInput.displayName = "PhoneNumberInput"

export { PhoneNumberInput }
