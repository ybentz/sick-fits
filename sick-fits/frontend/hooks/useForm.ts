import { useState } from 'react'

function useForm(initial: FormInputState = {}) {
  const [inputs, setInputs] = useState(initial)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = event.target
    const val = type === 'number' ? (value ? parseFloat(value) : '') : value
    setInputs({
      ...inputs,
      [name]: val,
    })
  }

  const resetForm = () => {
    setInputs(initial)
  }

  return {
    inputs,
    handleChange,
    resetForm,
    setInputsUnsafe: setInputs,
  }
}

export default useForm
