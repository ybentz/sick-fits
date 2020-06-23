import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset'
import { waitForApolloStateChange } from '../lib/testUtils'

const testEmail = 'test@gmail.com'
const mockMutation = {
  request: {
    query: REQUEST_RESET_MUTATION,
    variables: {
      email: testEmail,
    },
  },
  result: {
    data: { requestPasswordReset: { message: 'success' } },
  },
}

function generateComponent(mocks = []) {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <RequestReset />
    </MockedProvider>
  )
}

function getElements() {
  return {
    // <form> isn't an accessible role by default so we're querying the <fieldset>
    fieldset: screen.getByRole('group'),
    emailInput: screen.getByLabelText(/email/i),
    submitButton: screen.getByRole('button'),
  }
}

describe('<RequestReset/>', () => {
  it('renders', () => {
    render(generateComponent())

    const { fieldset, emailInput, submitButton } = getElements()
    expect(fieldset).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('submits form with correct values', async () => {
    render(generateComponent([mockMutation]))
    await waitForApolloStateChange()

    const { fieldset, emailInput, submitButton } = getElements()
    expect(fieldset).not.toBeDisabled()

    await userEvent.type(emailInput, testEmail)
    await userEvent.click(submitButton)

    expect(fieldset).toBeDisabled()

    await waitForApolloStateChange()

    expect(fieldset).not.toBeDisabled()
    expect(screen.queryByText(/Success/i)).toBeInTheDocument()
  })
})
