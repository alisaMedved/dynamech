import {type Page, type Locator, expect} from "@playwright/test";
import {BaseComponent} from "../baseComponent.page";
import {ProductWithBrandAndName} from "../pages/workspace.page";
import {logger} from "../../../shared/logs.config";
import {matchQuantityAndPrice, parseFloatPrice, parsePriceWithCurrencySymbol} from "../../../shared/utils/functions";

export class ShoppingCartPage extends BaseComponent {
    page: Page;
    shoppingCartTable: Locator;
    productNameAndBrand: Locator;
    productPricesAndQuantity: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.shoppingCartTable = this.page.locator('div[class^="component_fix-box__"]').filter({hasText: 'Shopping cart'})
        this.productNameAndBrand= this.shoppingCartTable.locator('div[class*="component_cart-product-list-item__cell_name__"]')
        this.productPricesAndQuantity = this.shoppingCartTable.locator('div[class*="component_cart-product-list-item__cell_price__"]')
    }

    async loadedPage() {
        await super.loadedElementOfPage(this.shoppingCartTable);
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
            expect(parseFloatPrice(parsePriceWithCurrencySymbol(totalPrice))).toEqual(parseFloatPrice(parsePriceWithCurrencySymbol(productOfRow.total)))

            const quantityAndPrice = await this.productPricesAndQuantity.nth(j).locator('div').nth(1).textContent()
            const {quantity, price} = matchQuantityAndPrice(quantityAndPrice)
            expect(price).toEqual(parseFloatPrice(parsePriceWithCurrencySymbol(productOfRow.price)))
            expect(quantity).toEqual(productOfRow.quantity)
            j++
        }
    }
}
