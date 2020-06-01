import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
`;

function Items({ page }) {
  const { data, error, loading } = useQuery(ALL_ITEMS_QUERY, {
    variables: {
      skip: (page - 1) * perPage
    },
  })

  return (
    <Center>
      <Pagination page={page} />
      {(() => {
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error.message}</p>;
        if (!data) return <p>Nothing to show!</p>;
        return (
          <ItemList>
            {data.items.map(item => (
              <Item item={item} key={item.id} />
            ))}
          </ItemList>
        );
      })()}
      <Pagination page={page} />
    </Center>
  );
}

export default Items;
export { ALL_ITEMS_QUERY };
