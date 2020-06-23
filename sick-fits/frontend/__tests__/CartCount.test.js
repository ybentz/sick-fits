import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

import CartCount from '../components/CartCount'

describe('<CartCount/>', () => {
  it('updates via props', async () => {
    const count = 50
    const { asFragment, container, rerender } = render(
      <CartCount count={count} />
    )
    expect(container).toHaveTextContent(count)
    // expect(asFragment()).toMatchSnapshot()
    const updatedCount = 10
    rerender(<CartCount count={updatedCount} />)
    // Wait for css transition to finish - there's probably a better way to do this
    // Should check this out https://testing-library.com/docs/example-react-transition-group
    await waitFor(() => {
      // There seems to be a better way to wait for element to disappear but I'm not sure how
      // it works with the container https://testing-library.com/docs/guide-disappearance#waiting-for-disappearance
      expect(container).not.toHaveTextContent(count)
    })
    expect(container).toHaveTextContent(updatedCount)
    // expect(asFragment()).toMatchSnapshot()
  })
})
