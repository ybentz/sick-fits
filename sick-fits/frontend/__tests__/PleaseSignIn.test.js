import { mount } from 'enzyme'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import PleaseSignIn from '../components/PleaseSignIn'
import { notSignedInMocks, signedInMocks } from '../lib/testMocks'

describe('<PleaseSignIn/>', () => {
  it('renders sign in dialog to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Please sign in before continuing')
    const Signin = wrapper.find('Signin')
    expect(Signin.exists()).toBe(true)
  })

  it('renders the child compoenent when user is signed in', async () => {
    const Child = () => <p>Hey!</p>
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Child />
        </PleaseSignIn>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(wrapper.contains(<Child />)).toBe(true)
  })
})
