import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// Next.js has a built in fetch polyfill but for some reason it's not loaded in the test env
// I'm not sure this is the best way to do it but it works so 🤷‍♂️
// Reference: https://github.com/vercel/next.js/pull/12353/commits/c9783265a65be0ce785906830f07aabdf78fd5b4
import fetch from 'next/dist/compiled/node-fetch'
if (!global.fetch) {
  global.fetch = fetch
}

import { ItemMockBuilder } from '../lib/mocks/itemMocks'
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem'
import { waitForApolloStateChange } from '../lib/testUtils'

// https://github.com/vercel/next.js/issues/7479#issuecomment-520048773
const useRouter = jest.spyOn(require('next/router'), 'useRouter')
const routerPush = jest.fn()
useRouter.mockReturnValue({
  push: routerPush,
})

const testItemId = 123
const testItem = new ItemMockBuilder().build()
const {
  description: testDescription,
  image,
  largeImage,
  price: testPrice,
  title: testTitle,
} = testItem

const mockMutation = {
  request: {
    query: CREATE_ITEM_MUTATION,
    variables: {
      description: testDescription,
      image,
      largeImage,
      price: testPrice,
      title: testTitle,
    },
  },
  result: {
    data: { createItem: { id: testItemId } },
  },
}

function generateComponent(mocks = []) {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <CreateItem />
    </MockedProvider>
  )
}

function getElements() {
  return {
    // <form> isn't an accessible role by default so we're querying the <fieldset>
    fieldset: screen.getByRole('group'),
    imageInput: screen.getByLabelText(/image/i),
    titleInput: screen.getByLabelText(/title/i),
    descriptionInput: screen.getByLabelText(/description/i),
    priceInput: screen.getByLabelText(/price/i),
    submitButton: screen.getByRole('button'),
  }
}

describe('<CreateItem/>', () => {
  it('renders', () => {
    render(generateComponent())

    const {
      fieldset,
      imageInput,
      titleInput,
      descriptionInput,
      priceInput,
      submitButton,
    } = getElements()
    expect(fieldset).toBeInTheDocument()
    expect(imageInput).toBeInTheDocument()
    expect(titleInput).toBeInTheDocument()
    expect(descriptionInput).toBeInTheDocument()
    expect(priceInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('submits form with correct values', async () => {
    render(generateComponent([mockMutation]))
    await waitForApolloStateChange()

    const {
      fieldset,
      imageInput,
      titleInput,
      descriptionInput,
      priceInput,
      submitButton,
    } = getElements()
    const testImageFile = new File(['dog'], 'dog-image.jpg', {
      type: 'image/jpeg',
    })
    expect(fieldset).not.toBeDisabled()

    // Clear default values
    await userEvent.clear(titleInput)
    await userEvent.clear(descriptionInput)
    await userEvent.clear(priceInput)

    // Set test values to inputs
    await userEvent.upload(imageInput, testImageFile)
    await userEvent.type(titleInput, testTitle)
    await userEvent.type(descriptionInput, testDescription)
    await userEvent.type(priceInput, testPrice.toString())
    // Make sure image finished "uploading" (it's mocked but still async using msw)
    await waitFor(() => expect(submitButton).not.toBeDisabled())
    await userEvent.click(submitButton)

    await waitForApolloStateChange()

    expect(routerPush).toHaveBeenCalled()
    expect(routerPush).toBeCalledWith({
      pathname: '/item',
      query: { id: testItemId },
    })
  })
})
