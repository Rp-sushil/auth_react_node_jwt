/// <reference types="Cypress" />

import {
  loginPage,
  login,
  loggedNavComp,
  resetPage,
} from "../../support/helper";

describe("Login Test...", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:5000/api/auth/login", {
      fixture: "loginResData.json",
    }).as("loggedIn");
    cy.intercept("GET", "http://localhost:5000/api/user/me", {
      fixture: "getUserResData.json",
    }).as("getUserInfo");
  });
  it("Should be able to login and redirect to dashboard", () => {
    loginPage();
    login();
    cy.wait("@loggedIn");
    cy.wait("@getUserInfo");
    cy.url().should("include", "/dashboard");
    cy.reload();
    cy.contains(/Newton/i);
  });
  it("Should not able to go [/login, /register routes (redirect to dashboard)] once logged in", () => {
    loginPage();
    login();
    cy.wait("@loggedIn");
    cy.wait("@getUserInfo");
    cy.url().should("include", "/dashboard");
    loginPage();
    cy.wait(1000);
    cy.wait("@getUserInfo");
    cy.url().should("include", "/dashboard");
  });
  it("Dashboard  and Reset page should contians three clickable links[Home(/), change-credentials(/change-credentials), Dashboard(/dashboard)], Logout", () => {
    loginPage();
    login();
    cy.wait("@loggedIn");
    cy.wait("@getUserInfo");
    loggedNavComp();
    resetPage();
    loggedNavComp();
  });
});
