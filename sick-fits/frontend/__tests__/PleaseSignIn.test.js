import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/react-testing'
import { render, screen } from '@testing-library/react'

import PleaseSignIn from '../components/PleaseSignIn'
import { UserMockBuilder } from '../lib/testMocks'
import { waitForApolloStateChange } from '../lib/testUtils'

describe('<PleaseSignIn/>', () => {
  it('renders sign in dialog to logged out users', async () => {
    const mockedUser = new UserMockBuilder().setSignedOut().build()
    render(
      <MockedProvider mocks={[mockedUser]}>
        <PleaseSignIn />
      </MockedProvider>
    )

    // Wait a bit longer than the useAutofill timer to avoid the `act()` warning
    // TODO - may want to mock the custom hook as it's not relevant to the test and shouldn't affect it
    await waitForApolloStateChange(150)
    expect(
      screen.getByText('Please sign in before continuing')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders the child compoenent when user is signed in', async () => {
    const mockedUser = new UserMockBuilder().setSignedIn().build()
    const childTextContent = 'Hey!'
    const Child = () => <p>{childTextContent}</p>
    render(
      <MockedProvider mocks={[mockedUser]}>
        <PleaseSignIn>
          <Child />
        </PleaseSignIn>
      </MockedProvider>
    )

    // Wait a bit longer than the useAutofill timer to avoid the `act()` warning
    await waitForApolloStateChange(150)
    expect(screen.getByText(childTextContent)).toBeInTheDocument()
    expect(screen.queryByText('Please sign in before continuing')).toBeNull()
  })
})
