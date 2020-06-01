import React from 'react';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import CartItem from './CartItem';
import { useUser } from './User'
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

const LOCAL_STATE_QUERY = gql`
  query {
    # @client annotation tells apollo to not fetch the data but grab it from local store
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    # @client annotation tells apollo to not fetch the data but grab it from local store
    toggleCart @client
  }
`;

function Cart() {
  const user = useUser()
  // TODO - consider replacing Apollo for local state with either Context API or Recoil
  const { data: localState } = useQuery(LOCAL_STATE_QUERY)
  const [ toggleCart ] = useMutation(TOGGLE_CART_MUTATION)

  if (!user) return null
  return (
    <CartStyles open={localState.cartOpen}>
      <header>
        <CloseButton title="close" onClick={toggleCart}>
          &times;
        </CloseButton>
        <Supreme>{user.name}'s Cart</Supreme>
        <p>
          You have {user.cart.length} item
          {user.cart.length === 1 ? '' : 's'} in your cart
        </p>
      </header>
      {user.cart.map((cartItem) => (
        <CartItem cartItem={cartItem} key={cartItem.id} />
      ))}
      <footer>
        <p>{formatMoney(calcTotalPrice(user.cart))}</p>
        <SickButton>Checkout</SickButton>
      </footer>
    </CartStyles>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
