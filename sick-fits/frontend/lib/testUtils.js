import casual from 'casual'
import { act } from 'react-dom/test-utils'
import wait from 'waait'

// seed it so we get consistent results
casual.seed(777)

const fakeItem = () => ({
  id: 'abc123',
  price: 5000,
  user: null,
  image: 'dog-small.jpg',
  title: 'dogs are best',
  description: 'dogs',
  largeImage: 'dog.jpg',
})

const fakeUser = () => ({
  id: '4234',
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
  orders: [],
  cart: [],
})

const fakeOrderItem = () => ({
  id: casual.uuid,
  image: `${casual.word}.jpg`,
  title: casual.words(),
  price: 4234,
  quantity: 1,
  description: casual.words(),
})

const fakeOrder = () => ({
  id: 'ord123',
  charge: 'ch_123',
  total: 40000,
  items: [fakeOrderItem(), fakeOrderItem()],
  createdAt: '2018-04 - 06T19: 24: 16.000Z',
  user: fakeUser(),
})

const fakeCartItem = (overrides) => ({
  id: 'omg123',
  quantity: 3,
  item: fakeItem(),
  user: fakeUser(),
  ...overrides,
})

// Fake LocalStorage
class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = value.toString()
  }

  removeItem(key) {
    delete this.store[key]
  }
}

// Used as a silly workaround to for the `act` warning when re-rendering after a state change
// due to how Apollo MockedProvider works (useQuery needs a tick to resolve the promise)
// More details here: https://trojanowski.dev/apollo-hooks-testing-without-act-warnings/
async function waitForApolloStateChange(ms = 0) {
  await act(() => {
    return wait(ms)
    // return new Promise((resolve) => {
    //   setTimeout(resolve, ms)
    // })
  })
}

export {
  LocalStorageMock,
  fakeItem,
  fakeUser,
  fakeCartItem,
  fakeOrder,
  fakeOrderItem,
  waitForApolloStateChange,
}
