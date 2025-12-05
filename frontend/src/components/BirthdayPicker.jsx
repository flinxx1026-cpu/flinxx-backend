import React from 'react'

const BirthdayPicker = ({ value, onChange, maxDate }) => {
  // Format maxDate to YYYY-MM-DD for the date input max attribute
  const maxDateString = maxDate 
    ? `${maxDate.getFullYear()}-${String(maxDate.getMonth() + 1).padStart(2, '0')}-${String(maxDate.getDate()).padStart(2, '0')}`
    : null

  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      max={maxDateString}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900"
      placeholder=""
      required
    />
  )
}

export default BirthdayPicker
