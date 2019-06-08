import ItemComponent from '../components/Item'
import { shallow } from 'enzyme'

const fakeItem = {
  title: 'Bla',
  id: 'ID1',
  price: 5000,
  description: 'Testing is real cool',
  image: 'image.png',
  largeImage: 'large-image.png',
}

describe('<Item/>', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<ItemComponent item={fakeItem} />)
  })

  it('renders and title and price properly', () => {
    const priceTag = wrapper.find('PriceTag')
    expect(priceTag.children().text()).toBe('$50')
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
  })

  it('renders and title and price properly', () => {
    const img = wrapper.find('img')
    expect(img.prop('src')).toBe(fakeItem.image)
    expect(img.prop('alt')).toBe(fakeItem.title)
  })

  it('renders the buttons properly', () => {
    const buttons = wrapper.find('.buttonList')
    expect(buttons.children()).toHaveLength(3)
    expect(buttons.find('Link').exists()).toBe(true)
    expect(buttons.find('AddToCart').exists()).toBe(true)
    expect(buttons.find('DeleteItem').exists()).toBe(true)
  })
})
