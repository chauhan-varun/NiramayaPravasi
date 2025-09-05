'use client'

import React from 'react'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import './phone-input.css'
import { cn } from '@/lib/utils'

const PhoneNumberInput = React.forwardRef(({ className, value, onChange, placeholder, error, size = "default", disabled = false, ...props }, ref) => {
  // Handle different phone number formats
  const normalizedValue = React.useMemo(() => {
    if (!value) return value;
    // If it's already E164 format, return as is
    if (typeof value === 'string' && value.match(/^\+\d{10,15}$/)) {
      return value;
    }
    // If it's a formatted string, try to normalize it
    if (typeof value === 'string') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length >= 10) {
        return '+1' + digitsOnly.slice(-10);
      }
    }
    return value;
  }, [value]);

  return (
    <PhoneInput
      ref={ref}
      value={normalizedValue}
      onChange={onChange}
      placeholder={placeholder || "Enter phone number"}
      defaultCountry="US"
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
