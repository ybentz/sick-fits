import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Pagination from '../components/Pagination'
import { waitForApolloStateChange } from '../lib/testUtils'
import { PaginationQueryMockBuilder } from '../lib/mocks/paginationMocks'
import { perPage } from '../config'

function generateComponent(page, mocks) {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Pagination page={page} />
    </MockedProvider>
  )
}

describe('<Pagination/>', () => {
  it('shows a loading state', () => {
    const mockedPaginationQuery = new PaginationQueryMockBuilder().build()
    render(generateComponent(1, [mockedPaginationQuery]))

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('renders the proper amount of pages', async () => {
    const itemCount = 18
    let currentPage = 1
    const maxPage = Math.ceil(itemCount / perPage)

    const mockedPaginationQuery = new PaginationQueryMockBuilder()
      .withItemCount(itemCount)
      .build()
    const { rerender } = render(
      generateComponent(currentPage, [mockedPaginationQuery])
    )
    await waitForApolloStateChange()

    const currentText = screen.getByTestId('current')
    const totalText = screen.getByTestId('total')

    expect(currentText).toHaveTextContent(
      // I don't love either of these becuase the first will break if the copy changes which is annoying
      // and the second is not so readable but seems better overall.
      // I'm testing it as 1 string so it's less fragile e.g. if the actual page is 11 but my test got 1 then it'll pass.
      // new RegExp(`Page ${currentPage} of ${maxPage}$`, 'i')
      new RegExp(` ${currentPage} \\D+ ${maxPage}$`, 'i')
    )
    expect(totalText).toHaveTextContent(new RegExp(`^${itemCount} `))

    // Middle page
    currentPage++
    rerender(generateComponent(currentPage, [mockedPaginationQuery]))
    await waitForApolloStateChange()

    expect(currentText).toHaveTextContent(
      new RegExp(` ${currentPage} \\D+ ${maxPage}$`, 'i')
    )
    expect(totalText).toHaveTextContent(new RegExp(`^${itemCount} `))

    // Last page
    rerender(generateComponent(maxPage, [mockedPaginationQuery]))
    await waitForApolloStateChange()

    expect(currentText).toHaveTextContent(
      new RegExp(` ${maxPage} \\D+ ${maxPage}$`, 'i')
    )
    expect(totalText).toHaveTextContent(new RegExp(`^${itemCount} `))
  })

  it('sets correct en/disable state for next/prev links', async () => {
    const itemCount = 18
    let currentPage = 1
    const maxPage = Math.ceil(itemCount / perPage)

    const mockedPaginationQuery = new PaginationQueryMockBuilder()
      .withItemCount(itemCount)
      .build()
    const { rerender } = render(
      generateComponent(currentPage, [mockedPaginationQuery])
    )
    await waitForApolloStateChange()

    const nextButton = screen.getByRole('link', { name: /next/i })
    const prevButton = screen.getByRole('link', { name: /prev/i })

    expect(prevButton).toHaveAttribute('aria-disabled', 'true')
    expect(nextButton).toHaveAttribute('aria-disabled', 'false')

    // Middle page
    currentPage++
    rerender(generateComponent(currentPage, [mockedPaginationQuery]))
    await waitForApolloStateChange()

    expect(prevButton).toHaveAttribute('aria-disabled', 'false')
    expect(nextButton).toHaveAttribute('aria-disabled', 'false')

    // Last page
    rerender(generateComponent(maxPage, [mockedPaginationQuery]))
    await waitForApolloStateChange()

    expect(prevButton).toHaveAttribute('aria-disabled', 'false')
    expect(nextButton).toHaveAttribute('aria-disabled', 'true')
  })
})
