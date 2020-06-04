import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'
import useForm from '../lib/useForm'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

function Signup(props) {
  const initialState = {
    email: '',
    name: '',
    password: '',
  }
  const { inputs, handleChange, resetForm } = useForm(initialState)
  const [signup, { error, loading }] = useMutation(SIGNUP_MUTATION, {
    variables: inputs,
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })

  return (
    <Form
      method="post"
      onSubmit={async (event) => {
        event.preventDefault()
        await signup()
        resetForm()
      }}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign up for an account</h2>
        <Error error={error} />
        {/* Hidden fields prevent chrome autofill because it's not triggering a 'change' event */}
        <input
          type="text"
          name="prevent_name_autofill"
          id="prevent_name_autofill"
          defaultValue=""
          style={{ display: 'none' }}
        />
        <input
          type="email"
          name="prevent_email_autofill"
          id="prevent_email_autofill"
          defaultValue=""
          style={{ display: 'none' }}
        />
        <input
          type="password"
          name="prevent_password_autofill"
          id="password_fake"
          defaultValue=""
          style={{ display: 'none' }}
        />
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
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={inputs.name}
            onChange={handleChange}
          />
        </label>
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
        <button type="submit">Sign up</button>
      </fieldset>
    </Form>
  )
}

export default Signup
