import React from 'react'
import Downshift, { resetIdCounter } from 'downshift'
import Router from 'next/router'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'
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

const routeToItem = item => {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  })
}

class AutoComplete extends React.Component {
  state = {
    loading: false,
    items: [],
  }
  onChange = debounce(async (e, client) => {
    this.setState({ loading: true })
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    })
    this.setState({
      items: res.data.items,
      loading: false,
    })
  }, 350)
  render() {
    // reset the id counter manually to prevent server and client render id mismatch by Downshit (Lecture 48 - ~12:00)
    resetIdCounter()
    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={item => (item === null ? '' : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist()
                        this.onChange(e, client)
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>Nothing found for {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default AutoComplete
