import Link from 'next/link'
import { useMutation } from '@apollo/react-hooks'
import NavStyles from './styles/NavStyles'
import { useUser } from './User'
import Signout from './Signout'
import { TOGGLE_CART_MUTATION } from './Cart'
import CartCount from './CartCount'

function Nav() {
  const user = useUser()
  const [toggleCart, { data }] = useMutation(TOGGLE_CART_MUTATION)

  return (
    <NavStyles>
      <Link href="/items">
        <a>Shop</a>
      </Link>
      {user && (
        <>
          <Link href="/sell">
            <a>Sell</a>
          </Link>
          <Link href="/orders">
            <a>Orders</a>
          </Link>
          <Link href="/me">
            <a>Account</a>
          </Link>
          <Signout />
          <button onClick={toggleCart}>
            My Cart
            <CartCount
              count={user.cart.reduce((acc, item) => acc + item.quantity, 0)}
            />
          </button>
        </>
      )}
      {!user && (
        <Link href="/signup">
          <a>Signin</a>
        </Link>
      )}
    </NavStyles>
  )
}

export default Nav
