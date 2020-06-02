import { useState } from 'react'

function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial)

  const handleChange = (event) => {
    const { name, type, value } = event.target
    const val = type === 'number' ? parseFloat(value) : value
    setInputs({
      ...inputs,
      [name]: val,
    })
  }

  return {
    inputs,
    handleChange,
  }
}

export default useForm
