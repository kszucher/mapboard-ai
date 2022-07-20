describe('empty spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/')

        cy.get('#email').type('krisztian@szucher.com')
        cy.get('#password').type('mncvmncv')
        cy.get('#sign-in').click()
        cy.get('#profile').click()
        cy.get('#sign-out').click()

    })
})
