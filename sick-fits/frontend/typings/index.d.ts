declare interface Dict<T> {
  [key: string]: T
}

declare type FormInputState = Dict<string | number>
