// This is a render prop component that fetches the current user data
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      cart {
        id
        quantity
        item {
          id
          title
          description
          image
          price
        }
      }
    }
  }
`

function useUser() {
  const { data } = useQuery(CURRENT_USER_QUERY)
  if (data) {
    return data.me
  }
}

export { CURRENT_USER_QUERY, useUser }
