import { fakeUser } from './testUtils'
import { SINGLE_ITEM_QUERY } from '../components/SingleItem'

class ItemMock implements Item {
  id: string
  description: string
  image: string
  largeImage: string
  price: number
  title: string
  user: User

  constructor() {
    this.id = '1234'
    this.description = 'Some description'
    this.image = 'dog-small.jpg'
    this.largeImage = 'dog.jpg'
    this.price = 5000
    this.title = 'Product Title'
    this.user = fakeUser()
  }
  withId(id: string) {
    this.id = id
    return this
  }
  withDescription(description: string) {
    this.description = description
    return this
  }
  withImage(url: string) {
    this.image = url
    return this
  }
  withLargeImage(url: string) {
    this.largeImage = url
    return this
  }
  withPrice(price: number) {
    this.price = price
    return this
  }
  withTitle(title: string) {
    this.title = title
    return this
  }
  withUser(user: User) {
    this.user = user
    return this
  }
}

class SingleItemQueryMockBuilder extends ItemMock {
  errorMessage: string

  withError(message) {
    this.errorMessage = message
    return this
  }

  build() {
    const request = { query: SINGLE_ITEM_QUERY, variables: { id: this.id } }
    if (this.errorMessage) {
      return {
        request,
        result: {
          errors: [{ message: this.errorMessage }],
        },
      }
    }

    return {
      request,
      result: {
        data: {
          item: {
            description: this.description,
            id: this.id,
            image: this.image,
            largeImage: this.largeImage,
            price: this.price,
            title: this.title,
            user: this.user,
          },
        },
      },
    }
  }
}

export { SingleItemQueryMockBuilder }
