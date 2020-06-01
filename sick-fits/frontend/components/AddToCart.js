import React from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import { CURRENT_USER_QUERY } from './User'

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`

function AddToCart(props) {
  const { id } = props
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  })
  return (
    <button onClick={addToCart} disabled={loading}>
      Add{loading && 'ing'} to Cart 🛒
    </button>
  )
}

export default AddToCart
