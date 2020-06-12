import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'
import useForm from '../hooks/useForm'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestPasswordReset(email: $email) {
      message
    }
  }
`

function RequestReset(props) {
  const initialState = {
    email: '',
  }
  const { inputs, handleChange, resetForm } = useForm(initialState)
  const [requestReset, { error, loading, called }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
    }
  )

  return (
    <Form
      method="post"
      onSubmit={async (event) => {
        event.preventDefault()
        await requestReset()
        resetForm()
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Request a password reset</h2>
        <Error error={error} />
        {!error && !loading && called && (
          <p>Success! Check you email for reset instructions</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Email"
            defaultValue={inputs.email}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset Password</button>
      </fieldset>
    </Form>
  )
}

export default RequestReset
export { REQUEST_RESET_MUTATION }
