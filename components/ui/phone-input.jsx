'use client'

import React from 'react'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import './phone-input.css'
import { cn } from '@/lib/utils'

const PhoneNumberInput = React.forwardRef(({ className, value, onChange, placeholder, error, size = "default", disabled = false, ...props }, ref) => {
  return (
    <PhoneInput
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Enter phone number"}
      defaultCountry="IN"
      international
      countryCallingCodeEditable={false}
      flags={flags}
      disabled={disabled}
      className={cn(
        "phone-input-container",
        size === "sm" && "sm",
        size === "lg" && "lg",
        error && "error",
        disabled && "disabled",
        className
      )}
      numberInputProps={{
        className: "phone-number-input",
        disabled: disabled
      }}
      countrySelectProps={{
        className: "country-select",
        disabled: disabled,
        "aria-label": "Select country"
      }}
      {...props}
    />
  )
})

PhoneNumberInput.displayName = "PhoneNumberInput"

export { PhoneNumberInput }
