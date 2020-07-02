import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import SingleItem from '../components/SingleItem'
import { SingleItemQueryMockBuilder } from '../lib/mocks/itemMocks'
import { waitForApolloStateChange } from '../lib/testUtils'

describe('<SingleItem/>', () => {
  it('should render', async () => {
    const mockedItemQuery = new SingleItemQueryMockBuilder().build()
    const data = mockedItemQuery.result.data.item
    render(
      <MockedProvider mocks={[mockedItemQuery]} addTypename={false}>
        <SingleItem id={data.id} />
      </MockedProvider>
    )
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitForApolloStateChange()

    expect(screen.queryByText(/loading/i)).toBeNull()
    expect(screen.getByRole('heading')).toHaveTextContent(data.title)
    expect(screen.getByText(data.description)).toBeInTheDocument()
    expect(screen.getByAltText(data.title)).toHaveAttribute(
      'src',
      data.largeImage
    )
  })

  it('should render error', async () => {
    const id = '123'
    const errorText = 'Items not found'
    const mockedItemQuery = new SingleItemQueryMockBuilder()
      .withId(id)
      .withError(errorText)
      .build()
    render(
      <MockedProvider mocks={[mockedItemQuery]} addTypename={false}>
        <SingleItem id={id} />
      </MockedProvider>
    )

    await waitForApolloStateChange()

    expect(screen.getByTestId('graphql-error')).toHaveTextContent(errorText)
    // expect(asFragment()).toMatchSnapshot()
  })
})
