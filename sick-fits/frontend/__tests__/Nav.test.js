import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import Nav from '../components/Nav'
import {
  notSignedInMocks,
  signedInMocks,
  signedInMocksWithCartItems,
} from '../lib/testMocks'

describe('<Nav/>', () => {
  it('renders minimal nav when sign out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const nav = wrapper.find('ul[data-test="nav"]')
    expect(toJSON(nav)).toMatchSnapshot()
  })

  it('renders full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const nav = wrapper.find('ul[data-test="nav"]')
    expect(nav.children().length).toBe(6)
    expect(nav.text()).toContain('Sign Out')
    expect(toJSON(nav)).toMatchSnapshot()
  })

  it('renders the amount of items in the cart', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const nav = wrapper.find('ul[data-test="nav"]')
    const count = nav.find('div.count')
    expect(toJSON(count)).toMatchSnapshot()
  })
})
