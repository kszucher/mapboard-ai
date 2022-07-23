describe('empty spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/')

        const [min, max] = [1000000, 9999999]
        const random =  Math.round(Math.random() * (max - min) + min)
        const randomUserEmail = 'cypress@test.com' + random

        cy.get('#sign-up-instead').click()
        cy.get('#your-first-name').type('Cypress Test')
        cy.get('#email').type(randomUserEmail)
        cy.get('#password').type('cypressPass')
        cy.get('#password-again').type('cypressPass')
        cy.get('#get-confirmation-code').click()
        cy.get('#confirmation-code').type('1234')
        cy.get('#enter-confirmation-code').click()
        cy.get('#sign-in').click()
        cy.get('#profile-button').click()
        cy.get('#profile-menu').contains('Sign Out').click()


        cy.get('#sign-up-instead').click()
        cy.get('#your-first-name').type('Cypress Test')
        cy.get('#email').type(randomUserEmail)
        cy.get('#password').type('cypressPass')
        cy.get('#password-again').type('cypressPass')
        cy.get('#get-confirmation-code').click()

        cy.get('#auth-feedback-message').should('have.text', 'Already confirmed')


        // TODO figure out a test for ALL 4 error code in auth
    })
})
