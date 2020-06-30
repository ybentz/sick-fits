import { PAGINATION_QUERY } from '../../components/Pagination'

class PaginationQueryMockBuilder {
  count: number
  errorMessage: string

  constructor() {
    this.count = 1
  }
  withItemCount(count: number): PaginationQueryMockBuilder {
    this.count = count
    return this
  }
  withError(message: string): PaginationQueryMockBuilder {
    this.errorMessage = message
    return this
  }

  build(): any {
    const request = { query: PAGINATION_QUERY }
    if (this.errorMessage) {
      return {
        request,
        result: {
          errors: [{ message: this.errorMessage }],
        },
      }
    }

    return {
      request,
      result: {
        data: {
          itemsConnection: {
            aggregate: {
              count: this.count,
            },
          },
        },
      },
    }
  }
}

export { PaginationQueryMockBuilder }
