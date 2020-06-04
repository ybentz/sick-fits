import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'
import useForm from '../lib/useForm'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      email: $email
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
    }
  }
`

function ResetPassword({ email, resetToken }) {
  const initialState = {
    password: '',
    confirmPassword: '',
  }
  const { inputs, handleChange, resetForm } = useForm(initialState)
  const [requestReset, { error, loading }] = useMutation(RESET_MUTATION, {
    variables: {
      ...inputs,
      email,
      resetToken,
    },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

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
        <h2>Reset your password</h2>
        <Error error={error} />
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            defaultValue={inputs.password}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            defaultValue={inputs.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset Password</button>
      </fieldset>
    </Form>
  )
}

ResetPassword.propTypes = {
  email: PropTypes.string.isRequired,
  resetToken: PropTypes.string.isRequired,
}

export default ResetPassword
