import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import useForm from '../hooks/useForm'
import Error from './ErrorMessage'
import Form from './styles/Form'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $image: String
    $largeImage: String
    $price: Int!
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

function CreateItem(props) {
  // File input is currently not handled by useForm so it's missing the image, largeImage fields
  const initialFormState = {
    description: 'Real pretty shoe description',
    price: 123,
    title: 'Pretty Shoes',
  }
  const { inputs, handleChange } = useForm(initialFormState)
  // Used to track the form file input for changes
  const [imageInputFiles, setImageInputFiles] = useState([])
  // Holds the uploaded urls of the chosen image after it was uploaded to the hosting service
  const [uploadedImageData, setUploadedImageData] = useState({
    image: null,
    largeImage: null,
  })
  const router = useRouter()

  const [createItem, { loading, error }] = useMutation(CREATE_ITEM_MUTATION, {
    variables: {
      ...inputs,
      ...uploadedImageData,
    },
  })

  useEffect(() => {
    async function uploadImage() {
      if (!imageInputFiles.length) {
        return
      }
      const data = new FormData()
      data.append('file', imageInputFiles[0])
      data.append('upload_preset', 'sickfits')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/ybentz/image/upload',
        {
          method: 'POST',
          body: data,
        }
      )

      const file = await res.json()
      setUploadedImageData({
        image: file.secure_url,
        largeImage: file.eager[0].secure_url,
      })
    }
    uploadImage()
  }, [imageInputFiles])

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await createItem()
        router.push({
          pathname: '/item',
          query: { id: res.data.createItem.id },
        })
      }}
    >
      <Error error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="file">
          Image
          <input
            type="file"
            id="file"
            name="file"
            placeholder="Upload image"
            required
            onChange={(e) => {
              setImageInputFiles(e.target.files)
            }}
          />
        </label>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            defaultValue={inputs.title}
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
            defaultValue={inputs.description}
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
            defaultValue={inputs.price}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  )
}

export default CreateItem
export { CREATE_ITEM_MUTATION }
