import {type Page, type Locator, expect} from "@playwright/test";
import { BasePage } from "../base.page";
import { PageRoutes } from "../../pageRoutes";
import {matchQuantityAndPrice, parseFloatPrice, parsePriceWithCurrencySymbol} from "../../../shared/utils/functions";
import {ConfirmationPage} from "./confirmation.page";
import {logger} from "../../../shared/logs.config";
import {ProductWithBrandAndName} from "./workspace.page";

export const newAddressIdSelectOption = 'New Address';

export class CheckoutPage extends BasePage {
    page: Page;
    route: Exclude<keyof typeof PageRoutes, "prototype">;
    selfPickUpCheckbox: Locator;
    billingAddressIsSame: Locator;

    billingAddressIdSelect: Locator;
    countrySelect: Locator;

    firstName: Locator;
    lastName: Locator;
    companyName: Locator;

    addressLine: Locator;
    city: Locator;
    zip: Locator;
    phone: Locator;
    addressNickname: Locator;

    paymentMethodBankTransfer: Locator;
    submitBtn: Locator;

    shippingError: Locator;

    cartTotalSub: Locator;
    cartTax: Locator;
    cartTotalGrand: Locator;

    shoppingCartTable: Locator;
    productNameAndBrand: Locator;
    productPricesAndQuantity: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.route = "checkout";
        this.billingAddressIsSame = this.page.getByTestId('billing-address-same-as-shipping')
        this.selfPickUpCheckbox = this.page.getByTestId('checkbox')

        this.billingAddressIdSelect = this.page.getByTestId('billing-address-id').or(this.page.getByTestId('shipping-address-id'))
        this.countrySelect = this.page.getByTestId('checkout[shipping-address][address-country]')

        this.firstName = this.page.locator('input[name="checkout[billing-address][first-name]"]').or(this.page.locator('input[name="checkout[shipping-address][first-name]"]'))
        this.lastName = this.page.locator('input[name="checkout[billing-address][last-name]"]').or(this.page.locator('input[name="checkout[shipping-address][last-name]"]'))
        this.companyName = this.page.locator('input[name="checkout[billing-address][company]"]').or(this.page.locator('input[name="checkout[shipping-address][company]"]'))

        this.addressLine = this.page.locator('input[name="checkout[billing-address][address-line1]"]').or(this.page.locator('input[name="checkout[shipping-address][address-line1]"]'))
        this.city = this.page.locator('input[name="checkout[billing-address][city]"]').or(this.page.locator('input[name="checkout[shipping-address][city]"]'))
        this.zip = this.page.locator('input[name="checkout[billing-address][zip]"]').or(this.page.locator('input[name="checkout[shipping-address][zip]"]'))
        this.phone = this.page.locator('input[name="checkout[billing-address][phone]"]').or(this.page.locator('input[name="checkout[shipping-address][phone]"]'))
        this.addressNickname = this.page.locator('input[name="checkout[billing-address][nickname]"]').or(this.page.locator('input[name="checkout[shipping-address][nickname]"]'))

        this.paymentMethodBankTransfer = this.page.locator('input[name="checkout[payment-method][payment-bank]"]')

        this.submitBtn = this.page.getByTestId('invoice-checkout-submit').nth(1)

        this.shippingError = this.page.getByTestId('shipping-methods')

        this.cartTotalSub = this.page.getByTestId('cart-total-sub')
        this.cartTax = this.page.getByTestId('cart-total-tax')
        this.cartTotalGrand = this.page.getByTestId('cart-total-grand')

        this.shoppingCartTable = this.page.locator('div[class^="component_fix-box__"]').filter({hasText: 'Shopping cart'})
        this.productNameAndBrand= this.shoppingCartTable.locator('div[class*="component_cart-product-list-item__cell_name__"]')
        this.productPricesAndQuantity = this.shoppingCartTable.locator('div[class*="component_cart-product-list-item__cell_price__"]')
    }

    async goto(options: {workspaceId: string}) {
        // @ts-ignore
        await super.goToPageURL(PageRoutes[this.route](options.workspaceId));

    }

    async loadedPage() {
        await super.loadedElementOfPage(this.submitBtn);
    }
    async checkProductInCart(products: ProductWithBrandAndName[]) {
        logger.info(`checkProductPricesInCart, products ${JSON.stringify(products)}`)

        let j = 0

        for (const productNameAndBrandCell of await this.productNameAndBrand.all()) {
            const mpnAndName = await productNameAndBrandCell.locator('div').textContent()

            const index = products.findIndex((elm) => {
                const reg = new RegExp(elm.name, "ig")
                return mpnAndName.search(reg) !== -1
            })
            const productOfRow = products[index]

            const brandLocator = productNameAndBrandCell.locator('ul').nth(0).locator('li').nth(0)
            const textFromBrandLocator = await brandLocator.textContent()
            expect(textFromBrandLocator.trim().toLowerCase()).toEqual(productOfRow.brand.trim().toLowerCase())

            const totalPrice = await this.productPricesAndQuantity.nth(j).locator('div').nth(0).textContent()
            logger.info(`checkProductPricesInCart totalPrice ${totalPrice}`)
            expect(parseFloatPrice(parsePriceWithCurrencySymbol(totalPrice))).toEqual(parseFloatPrice(parsePriceWithCurrencySymbol(productOfRow.total)))

            const quantityAndPrice = await this.productPricesAndQuantity.nth(j).locator('div').nth(1).textContent()
            const {quantity, price} = matchQuantityAndPrice(quantityAndPrice)
            expect(price).toEqual(parseFloatPrice(parsePriceWithCurrencySymbol(productOfRow.price)))
            expect(quantity).toEqual(productOfRow.quantity)
            j++
        }
    }

    async checkSubtotalAndTaxInCart(products: ProductWithBrandAndName[], isEuropeanUnion: boolean, isSelfPickup: boolean) {
         const formattedWorkspaceSubtotal = products.reduce((acc, product) => {
            acc = acc + parseFloatPrice(parsePriceWithCurrencySymbol(product.total));
            acc = Math.round(acc * 100)/100
            return acc
        }, 0)
        
        const cartSubtotalText = await this.cartTotalSub.textContent()
        const cartSubtotal = parseFloatPrice(parsePriceWithCurrencySymbol(cartSubtotalText))

        expect(cartSubtotal).toEqual(formattedWorkspaceSubtotal)

        const tax = await this.cartTax.textContent()
        logger.info(`tax checkout page assert ${tax}`)
        const formattedTax = parseFloatPrice(parsePriceWithCurrencySymbol(tax))
        logger.info(`tax checkout page assert formattedTax ${formattedTax}`)
        const grandTotal = await this.cartTotalGrand.textContent()
        const formattedGrandTotal = parseFloatPrice(parsePriceWithCurrencySymbol(grandTotal))

        if (!isSelfPickup && isEuropeanUnion) {

            await expect(async () => {
                expect(formattedTax).not.toBe(0)
            }).toPass({ intervals: [5000, 5000, 5000, 5000],
                timeout: 30000});

            expect(formattedGrandTotal).toEqual(formattedWorkspaceSubtotal + formattedTax)
            expect(formattedGrandTotal).toEqual(cartSubtotal + formattedTax)

        } else {

            expect(formattedTax).toEqual(0)
            expect(formattedGrandTotal).toEqual(formattedWorkspaceSubtotal)
            expect(formattedGrandTotal).toEqual(cartSubtotal)
        }
    }

    async placeOrderAndAsserIt(userPage: Page, isSuccessPlacingOrder: boolean) {

        if (isSuccessPlacingOrder) {
            const confirmationPage = new ConfirmationPage(userPage)
            await this.submitBtn.click();
            await confirmationPage.loadedPage()
            expect(userPage.url()).toContain(`${PageRoutes.baseClientURL}/${this.route}/${confirmationPage.route}`)
            return confirmationPage;
        } else {
            const elementBoundingBox = await this.shippingError.boundingBox();
            await this.submitBtn.click();
            await expect(this.shippingError).toBeVisible()
            expect(elementBoundingBox).not.toBeNull();
        }

    }

}
