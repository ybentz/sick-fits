import React from 'react'
import Link from 'next/link'
import { useMutation } from '@apollo/react-hooks'
import NavStyles from './styles/NavStyles'
import { useUser } from './User'
import Signout from './Signout'
import { TOGGLE_CART_MUTATION } from './Cart'
import CartCount from './CartCount'

function Nav() {
  const user = useUser()
  const [toggleCart] = useMutation(TOGGLE_CART_MUTATION)

  return (
    <NavStyles>
      <li>
        <Link href="/items">
          <a>Shop</a>
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
          </li>
          <li>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
          </li>
          <li>
            <Link href="/me">
              <a>Account</a>
            </Link>
          </li>
          <li>
            <Signout />
          </li>
          <li>
            <button onClick={toggleCart}>
              My Cart
              <CartCount
                count={user.cart.reduce((acc, item) => acc + item.quantity, 0)}
              />
            </button>
          </li>
        </>
      )}
      {!user && (
        <li>
          <Link href="/signup">
            <a>Signin</a>
          </Link>
        </li>
      )}
    </NavStyles>
  )
}

export default Nav
