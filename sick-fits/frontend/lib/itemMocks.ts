// import { MockedResponse } from '@apollo/react-testing'

import { fakeUser } from './testUtils'
import { SINGLE_ITEM_QUERY } from '../components/SingleItem'

class ItemMockBuilder implements Item {
  id: string
  description: string
  image: string
  largeImage: string
  price: number
  title: string
  user: User

  constructor() {
    this.id = '1234'
    this.description = 'Test description'
    this.image = 'test-dog-small.jpg'
    this.largeImage = 'test-dog.jpg'
    this.price = 5000
    this.title = 'Test Product Title'
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
  build(): Item {
    return {
      description: this.description,
      id: this.id,
      image: this.image,
      largeImage: this.largeImage,
      price: this.price,
      title: this.title,
      user: this.user,
    }
  }
}

class SingleItemQueryMockBuilder extends ItemMockBuilder {
  errorMessage: string

  withError(message: string) {
    this.errorMessage = message
    return this
  }

  // Should be returning type `MockedResponse` instead of `any but that complicates things
  // because TS doesn't handle the overload with same parameters signature this way
  build(): any {
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

export { ItemMockBuilder, SingleItemQueryMockBuilder }
