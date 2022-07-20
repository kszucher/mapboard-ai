describe('empty spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/')

        // cy.get('#email').type('krisztian@szucher.com')
        // cy.get('#password').type('mncvmncv')
        // cy.get('#sign-in').click()
        // cy.get('#profile').click()
        // cy.get('#sign-out').click()

        cy.get('#sign-up-instead').click()
        cy.get('#your-first-name').type('Mekk Elek')
        cy.get('#email').type('mekk@elek.com')
        cy.get('#password').type('mekkpass')
        cy.get('#password-again').type('mekkpass')
        cy.get('#get-confirmation-code').click()

    })
})

// TODO: ability to delete user from the app
// TODO: if user === 'Mekk Elek' then we should write a previously known confirmation code to the db (email flow later)
// TODO: write a test for all error scenarios with respect to the user workflow
