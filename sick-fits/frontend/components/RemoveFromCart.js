import React from 'react'
import { useMutation } from 'react-apollo'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY } from './User'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: none;
  &:hover {
    color: ${(props) => props.theme.red};
    cursor: pointer;
  }
`

function RemoveFromCart({ id }) {
  const [removeFromCart, { loading, error }] = useMutation(
    REMOVE_FROM_CART_MUTATION,
    {
      variables: { id },
      update,
      optimisticResponse: {
        __typename: 'Mutation',
        // the mocked response
        removeFromCart: {
          __typename: 'CartItem',
          id,
        },
      },
    }
  )
  // this gets called when the mutation's response returns
  // * Note: this gets the job done BUT there's a delay between the click and the item disappearing since
  // * we need to wait for the response, that's why we're using the `optimisticResponse` which allows us to
  // * temporarily mock the response. lecture 43, 4:30
  function update(cache, payload) {
    // 1. read cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY })
    // 2. remove item from cart
    const cartItemId = payload.data.removeFromCart.id
    data.me.cart = data.me.cart.filter((cartItem) => cartItem.id !== cartItemId)
    // 3. write to cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data })
  }

  return (
    <BigButton
      onClick={() => {
        removeFromCart().catch((err) => alert(err.message))
      }}
      disabled={loading}
      title="Delete Item"
    >
      &times;
    </BigButton>
  )
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
}

export default RemoveFromCart
