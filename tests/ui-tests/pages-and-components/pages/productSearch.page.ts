import {type Page, type Locator, expect} from "@playwright/test";
import {logger} from "../../../shared/logs.config";
import {BaseComponent} from "../baseComponent.page";
import {parseProductDetails} from "../../../shared/utils/functions";

export class ProductSearchPage extends BaseComponent {
    page: Page;
    searchInput: Locator;
    searchBtn: Locator;
    hideSearchResult: Locator;
    searchedProduct: Locator;
    failMessage: Locator;
    blocksOfPrice: Locator;
    addProductBtn: Locator;
    quantityTextbox: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.searchInput = this.page.getByPlaceholder('Start entering the product');
        this.searchBtn = this.page.getByRole('button', { name: 'Find' })
        this.hideSearchResult = this.page.locator('a[class^="_hideButton_"]')
        this.searchedProduct = this.page.locator('div[class^="_found_"]')
        this.failMessage = this.searchedProduct.locator('div[class^="_notFound"] > div[class^="_state_"]').filter({ hasText: 'Not found' })
        this.quantityTextbox = this.searchedProduct.locator('div').filter({ hasText: /^Quantity/ }).getByRole('textbox')
        this.blocksOfPrice = this.searchedProduct.locator('div[class^="_sample_"]').filter({ hasText: 'Price' }).filter({ hasText: 'Total' })
        this.addProductBtn = this.searchedProduct.locator('button').filter({ hasText: 'Add to workspace' })
    }

    async searchProduct(productNumber: string) {
        logger.info(`productNumber ${productNumber}`)
        if (!productNumber) {
            return false;
        }
        await this.searchInput.click()
        await this.searchInput.fill(productNumber);
        await this.searchBtn.click()
        await expect(async () => {
            await expect(this.searchedProduct).toContainText(productNumber.toUpperCase())
        }).toPass();
    }

    async setQuantity(quantity: number) {
        await this.quantityTextbox.click()
        await this.quantityTextbox.fill(quantity.toFixed())
    }

    async choseRandomPrice() {
        const count = await this.blocksOfPrice.count()
        const randomIndex = Math.floor(Math.random() * count)
        const text = await this.blocksOfPrice.nth(randomIndex).textContent()
        await this.blocksOfPrice.nth(randomIndex).click()
        return parseProductDetails(text)
    }
    async checkSearchedProduct(isFound: boolean) {
        if (isFound) {
            await expect(this.failMessage).not.toBeVisible()
        } else {
            await expect(this.failMessage).toBeVisible()
        }
    }

    // await page.goto('https://aqatesttask.dynamech.io/business-v2/login');
    // await page.getByPlaceholder('Email').click();
    // await page.getByPlaceholder('Email').fill('jgreenfelder@turner.com');
    // await page.getByLabel('Password').click();
    // await page.getByLabel('Password').click();
    // await page.getByLabel('Password').fill('customer');
    // await page.getByRole('button', { name: 'Login' }).click();

    async loadedPage() {
        await super.loadedElementOfPage(this.searchInput);
        await super.loadedElementOfPage(this.searchBtn);
    }
}
