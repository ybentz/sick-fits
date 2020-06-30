import React from 'react'
import { useState } from 'react'

export interface UseFormReturn {
  inputs: FormInputState
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void
  resetForm(): void
  setInputsUnsafe: React.Dispatch<React.SetStateAction<FormInputState>>
}

function useForm(initial: FormInputState = {}): UseFormReturn {
  const [inputs, setInputs] = useState(initial)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, type, value } = event.target
    const val = type === 'number' ? (value ? parseFloat(value) : '') : value
    setInputs({
      ...inputs,
      [name]: val,
    })
    return
  }

  const resetForm = (): void => {
    setInputs(initial)
    return
  }

  return {
    inputs,
    handleChange,
    resetForm,
    setInputsUnsafe: setInputs,
  }
}

export default useForm
