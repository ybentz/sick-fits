describe('Sign In Page', () => {
  beforeEach(() => {
    cy.visit('/signup')
  })

  // This is assuming an existing user in the db. I'm not paying too much attention to auth
  // related tests right now because that's not relevant for Lustre as we don't have login
  it('allows signing up successfully', () => {
    cy.get('a')
      .contains(/signin/i)
      .should('exist')
    cy.get('form')
      .contains(/sign in/i)
      .parents('form')
      .within(() => {
        cy.get('input[type="email"]').type('test@test.com')
        cy.get('input[type="password"]').type('123456')
        cy.get('button[type="submit"]').click()
      })
  })
})
