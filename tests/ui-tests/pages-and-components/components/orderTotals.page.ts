import {type Page, type Locator, expect} from "@playwright/test";
import {BaseComponent} from "../baseComponent.page";
import {ProductWithBrandAndName} from "../pages/workspace.page";
import {parseFloatPrice, parsePriceWithCurrencySymbol, roundFloatPrice} from "../../../shared/utils/functions";
import {logger} from "../../../shared/logs.config";

export class OrderTotalsPage extends BaseComponent {
    page: Page;
    cartTotalSub: Locator;
    cartTax: Locator;
    cartTotalGrand: Locator;
    
    constructor(page: Page) {
        super(page);
        this.page = page;
        this.cartTotalSub = this.page.getByTestId('cart-total-sub').or(this.page.getByTestId('invoice-total-sub'))
        this.cartTax = this.page.getByTestId('cart-total-tax').or(this.page.getByTestId('invoice-total-tax'))
        this.cartTotalGrand = this.page.getByTestId('cart-total-grand').or(this.page.getByTestId('invoice-total-grand'))
    }

    async loadedPage() {
        await super.loadedElementOfPage(this.cartTotalGrand);
    }

    async checkOrderTotals(products: ProductWithBrandAndName[], isEuropeanUnion: boolean, isSelfPickup: boolean) {
        const formattedWorkspaceSubtotal = products.reduce((acc, product) => {
            acc = acc + parseFloatPrice(parsePriceWithCurrencySymbol(product.total));
            acc = roundFloatPrice(acc)
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

            expect(formattedGrandTotal).toEqual(roundFloatPrice(formattedWorkspaceSubtotal + formattedTax))
            expect(formattedGrandTotal).toEqual(roundFloatPrice(cartSubtotal + formattedTax))

        } else {
            expect(formattedTax).toEqual(0)
            expect(formattedGrandTotal).toEqual(formattedWorkspaceSubtotal)
            expect(formattedGrandTotal).toEqual(cartSubtotal)
        }
    }
    
}
