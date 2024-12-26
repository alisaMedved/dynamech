import {type Page, type Locator, expect} from "@playwright/test";
import { BasePage } from "../base.page";
import { PageRoutes } from "../../pageRoutes";
import {matchQuantityAndPrice, parseFloatPrice, parsePriceWithCurrencySymbol} from "../../../shared/utils/functions";
import {ProductForAdd} from "./productSearch.page";

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

    cartTotalSub: Locator;
    cartTax: Locator;
    cartTotalGrand: Locator;
    productPricesAndQuantity: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.route = "checkout";
        this.billingAddressIsSame = this.page.getByTestId('billing-address-same-as-shipping')
        this.selfPickUpCheckbox = this.page.getByTestId('checkbox')

        this.billingAddressIdSelect = this.page.getByTestId('billing-address-id')
        this.countrySelect = this.page.getByTestId('checkout[shipping-address][address-country]')


        this.firstName = this.page.locator('input[name="checkout[billing-address][first-name]"]')
        this.lastName = this.page.locator('input[name="checkout[billing-address][last-name]"]')
        this.companyName = this.page.locator('input[name="checkout[billing-address][company]"]')

        this.addressLine = this.page.locator('input[name="checkout[billing-address][address-line1]"]')
        this.city = this.page.locator('input[name="checkout[billing-address][city]"]')
        this.zip = this.page.locator('input[name="checkout[billing-address][zip]"]')
        this.phone = this.page.locator('input[name="checkout[billing-address][phone]"]')
        this.addressNickname = this.page.locator('input[name="checkout[billing-address][nickname]"]')

        this.paymentMethodBankTransfer = this.page.locator('input[name="checkout[payment-method][payment-bank]"]')

        this.submitBtn = this.page.getByTestId('invoice-checkout-submit').nth(1)
        this.cartTotalSub = this.page.getByTestId('cart-total-sub')
        this.cartTax = this.page.getByTestId('cart-total-tax')
        this.cartTotalGrand = this.page.getByTestId('cart-total-grand')
        this.productPricesAndQuantity = this.page.locator('div[class*="component_cart-product-list-item__cell_price__"]')
    }

    async goto(options: {workspaceId: string}) {
        // @ts-ignore
        await super.goToPageURL(PageRoutes[this.route](options.workspaceId));

    }

    async loadedPage() {
        // await super.loadedElementOfPage(this.submitBtn);
    }
    async checkProductPricesInCart(products: ProductForAdd[]) {
        let i= 0;
        for await (let product of products) {
            const totalPrice = await this.productPricesAndQuantity.nth(i).locator('div').nth(0).textContent()
            const quantityAndPrice = await this.productPricesAndQuantity.nth(i).locator('div').nth(1).textContent()
            expect(parseFloatPrice(parsePriceWithCurrencySymbol(totalPrice))).toEqual(parseFloatPrice(product.total))
            const {quantity, price} = matchQuantityAndPrice(quantityAndPrice)
            expect(price).toEqual(parseFloatPrice(parsePriceWithCurrencySymbol(product.price)))
            expect(quantity).toEqual(product.quantity)
            i++;
        }
    }

    async checkSubtotalAndTaxInCart(products: ProductForAdd[], isEuropeanUnion: boolean) {
         const formattedWorkspaceSubtotal = products.reduce((acc, product) => {
            acc = acc + parseFloatPrice(parsePriceWithCurrencySymbol(product.total));
            acc = Math.round(acc * 100)/100
            return acc
        }, 0)
        
        const cartSubtotalText = await this.cartTotalSub.textContent()
        const cartSubtotal = parseFloatPrice(parsePriceWithCurrencySymbol(cartSubtotalText))

        expect(cartSubtotal).toEqual(formattedWorkspaceSubtotal)

        const tax = await this.cartTax.textContent()
        const formattedTax = parseFloatPrice(parsePriceWithCurrencySymbol(tax))
        const grandTotal = await this.cartTotalGrand.textContent()
        const formattedGrandTotal = grandTotal.replace(' ', '')
        if (isEuropeanUnion) {
            expect(formattedTax).not.toEqual(0)
            expect(formattedGrandTotal).toEqual(formattedWorkspaceSubtotal + formattedTax)
            expect(formattedGrandTotal).toEqual(cartSubtotal + formattedTax)
        } else {
            expect(formattedTax).toEqual(0)
            expect(formattedGrandTotal).toEqual(formattedWorkspaceSubtotal)
            expect(formattedGrandTotal).toEqual(cartSubtotal)
        }
    }
}
