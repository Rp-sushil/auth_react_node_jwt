/// <reference types="Cypress" />

import {
  homePage,
  loginPage,
  registerPage,
  navComp,
} from "../../support/helper";

describe("Testing Enviroment", () => {
  it("Testing system works as expected", () => {
    expect(true).to.equal(true);
  });
});

describe("Testing (UI)...", () => {
  it("Home page should contians three clickable links[Home(/), Login(/login), Register(/register)]", () => {
    homePage();
    navComp();
  });
  it("Login page should contians three clickable links[Home(/), Login(/login), Register(/register)", () => {
    loginPage();
    navComp();
  });
  it("Login page should contians a Form[Input fields (Types: email, password), and Login Button ]", () => {
    loginPage();
    cy.get("input[type='email']");
    cy.get("input[type='password']");
    cy.get("form").contains(/login/i);
  });
  it("Register page should contains three clickable links[Home(/), Login(/login), Register(/register)", () => {
    registerPage();
    navComp();
  });
  it("Register page should contians a Form[Input fields (Name:Text, Email:email, Password:password, Confirm Password:password), and Register Button", () => {
    registerPage();
    cy.get("input[type='text']");
    cy.get("input[type='email']");
    cy.get("input[type='password']").should("have.length", 2);
    cy.get("form").contains(/Register/i);
  });
});
