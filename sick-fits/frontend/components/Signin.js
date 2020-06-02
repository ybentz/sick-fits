import React, { useRef } from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'
import useAutofillForm from '../lib/useAutofillForm'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

function Signin(props) {
  const initialState = {
    email: '',
    password: '',
  }
  const emailField = useRef(null)
  const passwordField = useRef(null)
  const { inputs, handleChange, resetForm } = useAutofillForm(initialState, [
    { name: 'email', ref: emailField },
    { name: 'password', ref: passwordField },
  ])
  const [signin, { error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  return (
    <Form
      method="post"
      onSubmit={async (event) => {
        event.preventDefault()
        await signin()
        resetForm()
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign in to your account</h2>
        <Error error={error} />
        <label htmlFor="email">
          Email
          <input
            ref={emailField}
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            ref={passwordField}
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign in</button>
      </fieldset>
    </Form>
  )
}

export default Signin
