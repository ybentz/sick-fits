declare interface Dict<T> {
  [key: string]: T
}

declare type FormInputState = Dict<string | number>

declare type NamedRef = {
  name: string
  ref: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement>
}
