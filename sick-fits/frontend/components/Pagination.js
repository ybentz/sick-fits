import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';

import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
      const currentPage = props.page;
      const count = data.itemsConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);
      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits - page {currentPage}</title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: currentPage - 1 }
            }}
          >
            <a className="prev" aria-disabled={currentPage <= 1}>
              ← Prev
            </a>
          </Link>
          <p>
            Page {currentPage} of {pages}
          </p>
          <p>{count} items total</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: currentPage + 1 }
            }}
          >
            <a className="next" aria-disabled={currentPage >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
