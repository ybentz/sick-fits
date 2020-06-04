import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

function DeleteItem(props) {
  function update(cache, payload) {
    // manually update the cache on the client, so it matches the server
    // 1. read cache for the item we want
    const cachedData = cache.readQuery({ query: ALL_ITEMS_QUERY })
    // 2. filter deleted item out of the page
    cachedData.items = cachedData.items.filter(
      (item) => item.id !== payload.data.deleteItem.id
    )
    // 3. put items back in cache
    cache.writeQuery({
      query: ALL_ITEMS_QUERY,
      data: cachedData,
    })
  }

  const [deleteItem, { error }] = useMutation(DELETE_ITEM_MUTATION, {
    variables: { id: props.id },
    update,
    awaitRefetchQueries: true,
    // This doesn't seem to work, not sure why the ItemList view doesn't update.
    refetchQueries: [{ query: ALL_ITEMS_QUERY }],
  })

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure you wanna delete this item?')) {
          deleteItem().catch((e) => alert(e.message))
        }
      }}
    >
      {props.children}
    </button>
  )
}

export default DeleteItem
