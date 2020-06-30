import { CURRENT_USER_QUERY } from '../../components/User'
import { fakeUser, fakeCartItem } from '../testUtils'

class CurrentUserQueryMockBuilder {
  constructor() {
    this.cart = []
    // Default is signed out
    this.user = null
  }
  setSignedIn(user) {
    this.user = user || fakeUser()
    return this
  }
  setSignedOut() {
    this.user = null
    return this
  }
  withCartItems(count = 1, quantity = 1) {
    this.cart = Array(count).fill(fakeCartItem({ quantity }))
    return this
  }
  build() {
    return {
      request: { query: CURRENT_USER_QUERY },
      result: {
        data: {
          me: !this.user
            ? null
            : {
                ...this.user,
                cart: this.cart,
              },
        },
      },
    }
  }
}

export { CurrentUserQueryMockBuilder }
