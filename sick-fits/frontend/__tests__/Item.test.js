import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { DELETE_ITEM_MUTATION } from '../components/DeleteItem'

import ItemComponent from '../components/Item'

const fakeItem = {
  title: 'Bla',
  id: 'ID1',
  price: 5000,
  description: 'Testing is real cool',
  image: 'image.png',
  largeImage: 'large-image.png',
}

const apolloMocks = [
  {
    request: { query: DELETE_ITEM_MUTATION },
    result: {
      data: null,
    },
  },
]

// These are not great tests! They only test that the UI renders properly, there's no interaction or anything
// so it feels dumb to me. I think this whole thing can be replaced with a simple snapshot test to make sure
// the test breaks if the UI changes while being simple for the dev to update the snapshot.
describe('<Item/>', () => {
  it('renders properly', () => {
    const { asFragment } = render(
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <ItemComponent item={fakeItem} />
      </MockedProvider>
    )

    // Header (product name)
    const header = screen.getByRole('link', { name: fakeItem.title })
    expect(header).toBeInTheDocument()
    expect(header).toHaveAttribute('href', `/item?id=${fakeItem.id}`)

    // Price
    expect(screen.getByText('$50')).toBeInTheDocument()

    // Image
    const image = screen.getByAltText(fakeItem.title)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', fakeItem.image)

    // Buttons
    const editLink = screen.getByRole('link', { name: /edit/i })
    expect(editLink).toBeInTheDocument()
    expect(editLink).toHaveAttribute('href', `/update?id=${fakeItem.id}`)
    expect(
      screen.getByRole('button', { name: /add to cart/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /delete item/i })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button').length).toBe(2)

    expect(asFragment()).toMatchSnapshot()
  })
})
