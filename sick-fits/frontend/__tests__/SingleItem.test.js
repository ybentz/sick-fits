import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem'
import { fakeItem } from '../lib/testUtils'

describe('<SingleItem/>', () => {
  it('should render', async () => {
    const mocks = [
      {
        // when this request is made
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        // return this mock
        result: {
          data: {
            item: fakeItem(),
          },
        },
      },
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SingleItem id="123" />
      </MockedProvider>
    )
    expect(wrapper.text()).toBe('Loading...')
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot()
    expect(toJSON(wrapper.find('img'))).toMatchSnapshot()
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot()
  })

  it('should render error', async () => {
    const errorText = 'Items not found'
    const mocks = [
      {
        // when this request is made
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        // return this mock
        result: {
          errors: [{ message: errorText }],
        },
      },
    ]
    const wrapper = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SingleItem id="123" />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const item = wrapper.find('[data-test="graphql-error"]')
    expect(item.text()).toContain(errorText)
    expect(toJSON(item)).toMatchSnapshot()
  })
})
