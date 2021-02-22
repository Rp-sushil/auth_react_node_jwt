/// <reference types="Cypress" />

import { loginPage, login } from "../../support/helper";

describe("Dashboard Test...", () => {
  before(() => {
    cy.intercept("POST", "http://localhost:5000/api/auth/login", {
      fixture: "expireLoginResData.json",
    }).as("loggedIn");
    cy.intercept("GET", "http://localhost:5000/api/user/me", {
      fixture: "getUserResData.json",
    }).as("getUserInfo");
    cy.intercept("GET", "http://localhost:5000/api/auth/refresh", {
      fixture: "refreshResData.json",
    }).as("getRefreshToken");
  });
  it("Should be able to get UserInfo and reset tokens if [auth-token] expired", () => {
    loginPage();
    login();
    cy.wait("@loggedIn");
    cy.url().should("include", "/dashboard");
    cy.wait("@getRefreshToken");
    cy.wait("@getUserInfo");
    cy.reload();
    cy.contains(/newton/i);
  });
});
