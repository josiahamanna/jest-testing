describe("The home page", () => {
  it("should display page title", () => {
    cy.visit("/");
    cy.get("#home-page-title").should("contain", "FULLSTACK-JS MERN STARTER");
  });

  it("Should display sign in button", () => {
    cy.visit("/");
    cy.get("#sign-in-button").should("contain", "Sign In");
  });

  it("Should display join now in button", () => {
    cy.visit("/");
    cy.get("#join-now-button").should("contain", "Join Now");
  });

  it("Should navigate to auth/login", () => {
    cy.visit("/");
    cy.get("#sign-in-button").click();
    cy.url().should("contain", "auth/login");
  });

  it("Should navigate to auth/register", () => {
    cy.visit("/");
    cy.get("#join-now-button").click();
    cy.url().should("contain", "auth/register");
  });
});
