import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo';
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

function Pagination({ page }) {
  const { data, error, loading } = useQuery(PAGINATION_QUERY)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const currentPage = page;
  const count = data.itemsConnection.aggregate.count;
  const pages = Math.ceil(count / perPage);
  return (
    <PaginationStyles>
      <Head>
        <title>Sick Fits - page {currentPage}</title>
      </Head>
      <Link
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
};

export default Pagination;
