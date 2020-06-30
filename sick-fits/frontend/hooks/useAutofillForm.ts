import React, { useEffect } from 'react'

import useForm from './useForm'

export interface UseAutofillFormReturn {
  inputs: FormInputState
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void
  resetForm(): void
}

// Handles forms that use Chrome's autofill (NOT autocomplete) to get the filled values
// from the DOM
function useAutofillForm(
  initial: FormInputState = {},
  autofillNamedRefs: NamedRef[] = []
): UseAutofillFormReturn {
  const { inputs, handleChange, resetForm, setInputsUnsafe } = useForm(initial)
  useEffect(() => {
    if (!autofillNamedRefs.length) return
    const interval = setInterval(() => {
      if (autofillNamedRefs[0].ref.current) {
        const inputs = Object.fromEntries(
          autofillNamedRefs.map((namedRef) => {
            const { name, ref } = namedRef
            return [name, ref.current.value || '']
          })
        )
        clearInterval(interval)
        setInputsUnsafe(inputs)
      }
    }, 100)
    return () => clearInterval(interval)
    // using useEffect with no deps so it only runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    inputs,
    handleChange,
    resetForm,
  }
}

export default useAutofillForm
