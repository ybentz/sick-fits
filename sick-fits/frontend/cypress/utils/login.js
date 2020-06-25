export function loginWithToken() {
  cy.setCookie(
    'token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJja2J2OGphZzhwYnFuMDk3NTZhZ3hsZXoyIiwiaWF0IjoxNTkzMTIyMjkwfQ.aYZs3iajgvSMdCoxWnKQeuiuCvKcRCloTwxv3lR5Z0A'
  )
  cy.reload()
}

export function loginWithXHR() {
  // programmatically log in without needing the UI (requires page reload though)
  const req = cy.request({
    method: 'POST',
    url: 'http://localhost:4444/',
    failOnStatusCode: false,
    body: {
      operationName: 'SIGNIN_MUTATION',
      variables: {
        email: 'test@test.com',
        password: '123456',
      },
      query: `mutation SIGNIN_MUTATION($email: String!, $password: String!) {
          signin(email: $email, password: $password) {
            id
            email
            name
            __typename
          }
        }`,
    },
  })
  cy.reload()
  // Allow chaining if needed
  return req
}
