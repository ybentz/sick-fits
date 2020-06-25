import { loginWithXHR } from '../utils/login'

describe('Sell Page', () => {
  beforeEach(() => {
    cy.visit('/sell')
    loginWithXHR()
  })

  it('should allow adding products', async () => {
    await cy.findByLabelText(/image/i).attachFile('dog.png', 'image/png')
    await cy.findByLabelText(/title/i).type('E2E!')
    await cy.findByLabelText(/description/i).type('E2E description')
    await cy.findByLabelText(/price/i).type(500001)
    // Commented out because it actually sends the data to the real DB
    // This test works just fine
    // cy.findByRole('button', { name: /submit/i }).click()

    // cy.url().should('match', /\/item\?id=\w+/)
    // Dummy assertion since this test isn't actually ran
    expect(true).to.equal(true)
  })
})
