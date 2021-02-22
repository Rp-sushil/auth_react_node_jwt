/// <reference types="Cypress" />

import { registerPage, register } from "../../support/helper";

describe("Register Test...", () => {
  before(() => {
    cy.intercept("POST", "http://localhost:5000/api/auth/register", {
      fixture: "registerResData.json",
    }).as("registered");
  });

  it("should be able to Register and redirect to the Login(/login) once registered", () => {
    registerPage();
    register();
    cy.wait("@registered");
    cy.url().should("include", "/login");
  });
});
