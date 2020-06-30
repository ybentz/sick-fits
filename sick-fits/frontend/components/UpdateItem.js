import React from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import useForm from '../hooks/useForm'
import Form from './styles/Form'
import Error from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

function UpdateItem({ id }) {
  const { data = {}, loading: itemLoading } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id },
  })
  const { item } = data
  const { inputs, handleChange } = useForm(item || {})
  const [
    updateItemMutation,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_ITEM_MUTATION, {
    variables: {
      id,
      ...inputs,
    },
  })

  const updateItem = async (e) => {
    e.preventDefault()
    await updateItemMutation({
      variables: {
        id,
        ...inputs,
      },
    })
  }

  if (itemLoading) return <p>Loading...</p>
  if (!item) return <p>No data found for ID {id}</p>
  return (
    <Form onSubmit={updateItem}>
      <Error error={mutationError} />
      <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            defaultValue={item.title}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Enter a description"
            required
            defaultValue={item.description || ''}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            required
            defaultValue={item.price}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sav{mutationLoading ? 'ing' : 'e'}</button>
      </fieldset>
    </Form>
  )
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
