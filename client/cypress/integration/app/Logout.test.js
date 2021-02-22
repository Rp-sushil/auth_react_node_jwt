/// <reference types="Cypress" />

import { loginPage, login, navComp } from "../../support/helper";

describe("Logout Test...", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:5000/api/auth/login", {
      fixture: "loginResData.json",
    }).as("loggedIn");
    cy.intercept("GET", "http://localhost:5000/api/user/me", {
      fixture: "getUserResData.json",
    }).as("getUserInfo");
    cy.intercept("DELETE", "http://localhost:5000/api/auth/logout", {
      fixture: "logoutResData.json",
    }).as("loggedOut");
  });
  it("Should be able to login and redirect to dashboard", () => {
    loginPage();
    login();
    cy.wait("@loggedIn");
    cy.wait("@getUserInfo");
    cy.url().should("include", "/dashboard");
    cy.contains(/Logout/i).click({ force: true });
    cy.wait("@loggedOut");
    cy.url().should("eql", "http://localhost:3000/");
    cy.getCookies().should("have.length", 0);
    navComp();
  });
});
