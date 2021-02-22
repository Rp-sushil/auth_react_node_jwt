export const navComp = () => {
  cy.contains(/Home/i).should("have.attr", "href", "/");
  cy.contains(/Login/i).should("have.attr", "href", "/login");
  cy.contains(/Register/i).should("have.attr", "href", "/register");
};

export const loggedNavComp = () => {
  cy.contains(/Home/i).should("have.attr", "href", "/");
  cy.contains(/Logout/i);
  cy.contains(/change credentials/i).should(
    "have.attr",
    "href",
    "/change-credentials"
  );
  cy.contains(/Dashboard/i).should("have.attr", "href", "/dashboard");
};

export const loginPage = () => {
  cy.visit("http://localhost:3000/login");
};

export const homePage = () => {
  cy.visit("http://localhost:3000");
};

export const registerPage = () => {
  cy.visit("http://localhost:3000/register");
};

export const resetPage = () => {
  cy.visit("http://localhost:3000/change-credentials");
};

export const register = () => {
  cy.get("input[type='text']").type("Newton School");
  cy.get("input[type='email']").type("newtonschool@example.com");
  cy.get("input[type='password']").then((els) => {
    [...els].forEach((el) => cy.wrap(el).type("PASSWORD"));
  });
  cy.get("form")
    .contains(/Register/i)
    .click({ force: true });
};

export const login = () => {
  cy.get("input[type='email']").type("newtonschool@example.com");
  cy.get("input[type='password']").type("password");
  cy.get("form").contains(/login/i).click();
};

export const reset = () => {
  cy.get("input[type='password']").then(($ele) => {
    cy.wrap($ele[0]).type("PASSWORD");
    cy.wrap($ele[1]).type("NEWPASSWORD");
    cy.wrap($ele[2]).type("NEWPASSWORD");
  });
  cy.get("form").contains(/reset/i).click();
};
