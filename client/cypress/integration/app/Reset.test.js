/// <reference types="Cypress" />

import { loginPage, login, resetPage, reset } from "../../support/helper";

const gotoResetPage = () => {
  loginPage();
  login();
  cy.wait("@loggedIn");
  cy.wait("@getUserInfo");
  resetPage();
};

describe("Reset Test...", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:5000/api/auth/login", {
      fixture: "loginResData.json",
    }).as("loggedIn");
    cy.intercept("GET", "http://localhost:5000/api/user/me", {
      fixture: "getUserResData.json",
    }).as("getUserInfo");
    cy.intercept("POST", "http://localhost:5000/api/user/change-credentials", {
      fixture: "resetResData.json",
    }).as("resetPassword");
  });
  it("Reset page should contain a form [input fields for old password, new password, confirm new password and Reset button]", () => {
    loginPage();
    login();
    cy.wait("@loggedIn");
    cy.wait("@getUserInfo");
    resetPage();
    cy.url().should("include", "/change-credentials");
    cy.get("input[type='password']").should("have.length", 3);
  });
  it("Should be able to reset password and on Sccuessfull password clear input fields", () => {
    gotoResetPage();
    reset();
    cy.wait("@resetPassword");
    cy.get("input[type='password']").then(($e) => {
      [...$e].forEach((x) => {
        cy.wrap(x).should("have.value", "");
      });
    });
  });
});
