import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import Head from 'next/head'
import Error from './ErrorMessage'

const SingleItemStyles = styled.div`
  max-width: 1200px;
  min-height: 800px;
  margin: 2rem auto;
  box-shadow: ${(props) => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`

function SingleItem(props) {
  const { error, loading, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id: props.id },
  })

  if (error) return <Error error={error} />
  if (loading) return <p>Loading...</p>
  if (!data.item) return <p>No item found for {this.props.id}</p>

  const { item } = data
  return (
    <SingleItemStyles>
      <Head>
        <title>Sick Fits | {item.title}</title>
      </Head>
      <img src={item.largeImage} alt="Item image" />
      <div className="details">
        <h2>Viewing {item.title}</h2>
        <p>{item.description}</p>
      </div>
    </SingleItemStyles>
  )
}

export default SingleItem
export { SINGLE_ITEM_QUERY }
