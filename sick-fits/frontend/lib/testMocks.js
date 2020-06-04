import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } },
  },
]

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } },
  },
]

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()],
        },
      },
    },
  },
]

class UserMockBuilder {
  constructor() {
    this.cart = []
    this.user = null
  }
  setSignedIn() {
    this.user = fakeUser()
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

export {
  notSignedInMocks,
  signedInMocks,
  signedInMocksWithCartItems,
  UserMockBuilder,
}
