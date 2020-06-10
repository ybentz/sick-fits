declare interface Dict<T> {
  [key: string]: T
}

declare type FormInputState = Dict<string | number>

declare type NamedRef = {
  name: string
  ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>
}

declare type User = {
  cart: CartItem[]
  email: string
  id: string
  name: string
  permissions: string[]
  // TODO - should implement OrderItem type
  orders: any[]
}

declare type CartItem = {
  id: string
  item: Item
  quantity: number
  user: User
}

declare interface Item {
  id: string
  description: string
  image: string
  largeImage: string
  price: number
  title: string
  user: User
}
