import { UseAutofillFormReturn } from '../../hooks/useAutofillForm'

function useAutofillForm(initial: FormInputState = {}): UseAutofillFormReturn {
  return {
    inputs: initial,
    handleChange: () => {},
    resetForm: () => {},
  }
}

export default useAutofillForm
