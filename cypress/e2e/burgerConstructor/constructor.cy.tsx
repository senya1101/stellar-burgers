import { deleteCookie } from '../../../src/utils/cookie';

const ingredientAttr = '[data-cy=ingredient]';
const addIngredientButtonText = 'Добавить';
const burgerConstructorAttr = '[data-cy=burger-constructor]';
const burgerConstructorBun = '[data-cy=burger-constructor-bun]';
const burgerConstructorMain = '[data-cy=burger-constructor-main]';
const ingredientsMain = '[data-cy=ingredients-main]';
const ingredientsBun = '[data-cy=ingredients-bun]';
const ingredientsSauce = '[data-cy=ingredients-sauce]';
const modal = '[data-cy=modal]';
const modalOverlay = '[data-cy=modal-overlay]';
const modalClose = '[data-cy=modal-close]';
const makeOrderButton = 'Оформить заказ';

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });
  it('Add main ingredient to constructor', () => {
    cy.get(ingredientsMain).find(ingredientAttr).first().as('ingredientMain');
    cy.get('@ingredientMain').contains(addIngredientButtonText).click();
    cy.get('@ingredientMain')
      .find('a > p')
      .invoke('text')
      .then((text) => {
        cy.get(burgerConstructorMain)
          .eq(0)
          .invoke('text')
          .should('contain', text);
      });
  });
  it('Add bun ingredient to constructor', () => {
    cy.get(ingredientsBun).find(ingredientAttr).first().as('ingredientBun');
    cy.get('@ingredientBun').contains(addIngredientButtonText).click();
    cy.get('@ingredientBun')
      .find('a > p')
      .invoke('text')
      .then((text) => {
        cy.get(burgerConstructorBun)
          .eq(0)
          .invoke('text')
          .should('contain', text);
        cy.get(burgerConstructorBun)
          .eq(1)
          .invoke('text')
          .should('contain', text);
      });
  });
  it('Open ingredient modal', () => {
    cy.get(ingredientsBun)
      .find(ingredientAttr)
      .first()
      .as('ingredient')
      .click();
    cy.get(modal).as('modal').should('be.visible');
    cy.get('@ingredient')
      .find('a > p')
      .invoke('text')
      .then((text) => {
        cy.get('@modal').invoke('text').should('contain', text);
      });
  });
  it('Close ingredient modal with button', () => {
    cy.get(ingredientsBun)
      .find(ingredientAttr)
      .first()
      .as('ingredient')
      .click();
    cy.get(modal).as('modal').should('be.visible');
    cy.get(modalClose).click();
    cy.get('@modal').should('not.exist');
  });
  it('Close ingredient modal with overlay', () => {
    cy.get(ingredientsBun)
      .find(ingredientAttr)
      .first()
      .as('ingredient')
      .click();
    cy.get(modal).as('modal').should('be.visible');
    cy.get(modalOverlay).click({ force: true });
    cy.get('@modal').should('not.exist');
  });
  it('Make order', () => {
    cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'orderRequest'
    );
    cy.get(ingredientsBun)
      .find(ingredientAttr)
      .first()
      .contains(addIngredientButtonText)
      .click();
    cy.get(burgerConstructorAttr).contains(makeOrderButton).click();
    cy.contains('Войти').click();
    cy.get(burgerConstructorAttr).contains(makeOrderButton).click();
    cy.wait('@orderRequest').then(() => {
      cy.fixture('order.json').then(
        (orderData: { order: { number: number } }) => {
          cy.get(modal)
            .invoke('text')
            .should('contain', orderData.order.number);
        }
      );
    });
    cy.get(modalClose).click();
    cy.get(burgerConstructorBun).eq(0).should('contain', 'Выберите булки');
    cy.get(burgerConstructorBun).eq(1).should('contain', 'Выберите булки');
    cy.get(burgerConstructorMain).eq(0).should('contain', 'Выберите начинку');
  });

  after(() => {
    localStorage.clear();
    deleteCookie('accessToken');
  });
});
