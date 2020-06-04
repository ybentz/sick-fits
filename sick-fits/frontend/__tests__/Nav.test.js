import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

import Nav from '../components/Nav'
import { UserMockBuilder } from '../lib/testMocks'
import { waitForApolloStateChange } from '../lib/testUtils'

describe('<Nav/>', () => {
  it('renders minimal nav when sign out', async () => {
    const mockedUser = new UserMockBuilder().setSignedOut().build()
    const { asFragment } = render(
      <MockedProvider mocks={[mockedUser]} addTypename={false}>
        <Nav />
      </MockedProvider>
    )
    await waitForApolloStateChange()
    // await waitFor(() => {})
    expect(screen.getByRole('link', { name: /signin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /shop/i })).toBeInTheDocument()

    expect(screen.queryByRole('link', { name: /sell/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /orders/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /account/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /sign out/i })).toBeNull()
    expect(screen.queryByRole('button', { name: /my cart/i })).toBeNull()
    // expect(asFragment()).toMatchSnapshot()
  })

  it('renders full nav when signed in', async () => {
    const mockedUser = new UserMockBuilder().setSignedIn().build()
    const { asFragment } = render(
      <MockedProvider mocks={[mockedUser]} addTypename={false}>
        <Nav />
      </MockedProvider>
    )
    await waitForApolloStateChange()
    // await waitFor(() => {})
    expect(screen.getByRole('link', { name: /shop/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sell/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /orders/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /account/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /my cart/i })).toBeInTheDocument()

    expect(screen.queryByRole('link', { name: /signin/i })).toBeNull()
    // expect(asFragment()).toMatchSnapshot()
  })

  it('renders the amount of items in the cart', async () => {
    const cartItemsCount = 4
    const mockedUser = new UserMockBuilder()
      .setSignedIn()
      .withCartItems(cartItemsCount)
      .build()

    const { asFragment } = render(
      <MockedProvider mocks={[mockedUser]} addTypename={false}>
        <Nav />
      </MockedProvider>
    )
    await waitForApolloStateChange()
    // await waitFor(() => {})
    const cartButton = await screen.findByRole('button', {
      name: /my cart/i,
    })
    expect(cartButton).toHaveTextContent(cartItemsCount)
    // expect(asFragment()).toMatchSnapshot()
  })
})
