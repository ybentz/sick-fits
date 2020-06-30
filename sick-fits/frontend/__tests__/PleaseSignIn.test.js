import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import PleaseSignIn from '../components/PleaseSignIn'
import { CurrentUserQueryMockBuilder } from '../lib/mocks/userMocks'
import { waitForApolloStateChange } from '../lib/testUtils'

// Mocking useAutofillForm hook to avoid the `act()` warning since the hook is using useEffect
// internally and triggers an async change
jest.mock('../hooks/useAutofillForm')

describe('<PleaseSignIn/>', () => {
  it('renders sign in dialog to logged out users', async () => {
    const mockedUser = new CurrentUserQueryMockBuilder().setSignedOut().build()
    render(
      <MockedProvider mocks={[mockedUser]} addTypename={false}>
        <PleaseSignIn />
      </MockedProvider>
    )

    await waitForApolloStateChange()
    expect(
      screen.getByText('Please sign in before continuing')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders the child compoenent when user is signed in', async () => {
    const mockedUser = new CurrentUserQueryMockBuilder().setSignedIn().build()
    const childTextContent = 'Hey!'
    const Child = () => <p>{childTextContent}</p>
    render(
      <MockedProvider mocks={[mockedUser]} addTypename={false}>
        <PleaseSignIn>
          <Child />
        </PleaseSignIn>
      </MockedProvider>
    )

    await waitForApolloStateChange()
    expect(screen.getByText(childTextContent)).toBeInTheDocument()
    expect(screen.queryByText('Please sign in before continuing')).toBeNull()
  })
})
