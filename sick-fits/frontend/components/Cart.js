import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';

import CartItem from './CartItem';
import User, { useUser } from './User'
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

const Composed = adopt({
  // This works but generates an error in the console on run time, the code that's not commented out just removes the error
  // toggleCart: <Mutation mutation={TOGGLE_CART_MUTATION} />,
  // localState: <Query query={LOCAL_STATE_QUERY}/>
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => {
  const user = useUser()

  return (
    <Composed>
      {({ toggleCart, localState }) => {
        if (!user) return null
        return (
          <CartStyles open={localState.data.cartOpen}>
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
      }}
    </Composed>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
