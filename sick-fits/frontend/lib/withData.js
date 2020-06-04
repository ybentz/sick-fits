import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, Observable } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import withApollo from 'next-with-apollo'

import { LOCAL_STATE_QUERY } from '../components/Cart'
import { endpoint } from '../config'

const cache = new InMemoryCache()

async function request(operation, options) {
  operation.setContext({
    fetchOptions: {
      credentials: 'include',
    },
    headers: options.headers,
  })
}

function requestLinkWithOptions(options) {
  return new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle
        Promise.resolve(operation)
          .then((oper) => request(oper, options))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            })
          })
          .catch(observer.error.bind(observer))
        return () => {
          if (handle) handle.unsubscribe()
        }
      })
  )
}

function createClient({ headers }) {
  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          // Handle/log graphQL errors - just console logging for now
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          )
        // Handle/log network errors - just console logging for now
        if (networkError) console.log(`[Network error]: ${networkError}`)
      }),
      requestLinkWithOptions({ headers }),
      new HttpLink({
        uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
        credentials: 'include',
      }),
    ]),
    resolvers: {
      Mutation: {
        // first argument unknown and unused lol
        toggleCart(_, variables, { cache }) {
          // read cartOpen value from cache
          const { cartOpen } = cache.readQuery({
            query: LOCAL_STATE_QUERY,
          })
          const data = {
            data: { cartOpen: !cartOpen },
          }
          cache.writeData(data)
          return data
        },
      },
    },
  })
}

// Add default local state
cache.writeData({
  data: {
    cartOpen: false,
  },
})

export default withApollo(createClient)
