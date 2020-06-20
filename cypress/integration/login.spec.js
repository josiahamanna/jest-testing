describe("The logic process", () => {
  it("should login a user, flash a message, and redirect to home", () => {
    cy.server();

    cy.fixture("user").as("user");

    cy.route("POST", "api/v1/auth/login", "@user");

    cy.visit("/auth/login");

    cy.get('input[name="email"]').type("danait@jacob.com");
    cy.get('input[name="password"]').type("password");

    cy.get("button").click();
  });
});
