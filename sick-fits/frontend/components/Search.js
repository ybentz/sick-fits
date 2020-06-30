import React from 'react'
import { useCombobox, resetIdCounter } from 'downshift'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'
import { useLazyQuery } from '@apollo/react-hooks'
import debounce from 'lodash.debounce'

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`

function routeToItem(selectedItem, router) {
  router.push({
    pathname: '/item',
    query: {
      id: selectedItem.id,
    },
  })
}

function AutoComplete() {
  const router = useRouter()
  const [findItems, { data, loading }] = useLazyQuery(SEARCH_ITEMS_QUERY)
  const items = data ? data.items : []
  const debouncedFindItemsQuery = debounce(findItems, 350)
  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    inputValue,
    isOpen,
  } = useCombobox({
    items,
    itemToString: (item) => (item ? item.title : ''),
    onInputValueChange: ({ inputValue }) => {
      debouncedFindItemsQuery({
        variables: { searchTerm: inputValue },
      })
    },
    onSelectedItemChange: ({ selectedItem }) =>
      routeToItem(selectedItem, router),
  })
  // reset the id counter manually to prevent server and client render id mismatch by Downshit (Lecture 48 - ~12:00)
  resetIdCounter()

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
        <DropDown {...getMenuProps()}>
          {isOpen &&
            items.map((item, index) => (
              <DropDownItem
                {...getItemProps({ item, index })}
                key={item.id}
                highlighted={index === highlightedIndex}
              >
                <img width="50" src={item.image} alt={item.title} />
                {item.title}
              </DropDownItem>
            ))}
          {isOpen && !items.length && !loading && (
            <DropDownItem>Nothing found for {inputValue}</DropDownItem>
          )}
        </DropDown>
      </div>
    </SearchStyles>
  )
}

export default AutoComplete
