function useAutofillForm(
  initial: FormInputState = {},
  autofillNamedRefs: NamedRef[] = []
) {
  return {
    inputs: initial,
    handleChange: () => {},
    resetForm: () => {},
  }
}

export default useAutofillForm
