import React, { useRef, useEffect } from 'react'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

const BirthdayPicker = ({ value, onChange, maxDate }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode: 'single',
        dateFormat: 'Y-m-d',
        maxDate: maxDate || new Date(),
        yearRange: [1950, new Date().getFullYear()],
        defaultDate: value || null,
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const date = selectedDates[0]
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            onChange(formattedDate)
          }
        }
      })
    }
  }, [maxDate])

  return (
    <input
      ref={inputRef}
      type="text"
      value={value || ''}
      placeholder="Select your birthday (YYYY-MM-DD)"
      readOnly
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
      style={{ cursor: 'pointer' }}
    />
  )
}

export default BirthdayPicker
