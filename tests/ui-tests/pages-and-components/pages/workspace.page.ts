import {type Page, type Locator, FrameLocator, expect, BrowserContext} from "@playwright/test";
import { BasePage } from "../base.page";
import { PageRoutes } from "../../pageRoutes";
import {logger} from "../../../shared/logs.config";
import {ProductForAdd, ProductSearchPage} from "../components/productSearch.page";
import {
  parseFloatPrice,
  parsePriceWithCurrencySymbol,
  parseTotalPrice,
  roundFloatPrice
} from "../../../shared/utils/functions";
import {CheckoutPage} from "./checkout.page";

export enum WAYS_OF_PRODUCT_ADDITION {
  product_search,
  upload_file,
  paste_text
}

export interface ProductWithBrandAndName extends ProductForAdd {
  brand: string;
  name: string;
}

export type CellTypes = 'Quantity' | 'MPN' | 'Price' | 'Total' | 'Name' | 'Brand'

export class WorkspacePage extends BasePage {
  page: Page;
  route: Exclude<keyof typeof PageRoutes, "prototype">;
  workspaceTitle: Locator;
  addWorkspaceBtn: Locator;
  workspaceList: Locator;
  productSearchTab: Locator;
  uploadFileTab: Locator;
  pasteTextTab: Locator;
  productsTable: Locator;
  productRow: Locator;
  blockOfSubtotals: Locator;
  subtotalQuantityValue: Locator;
  subtotalPriceValue: Locator;
  checkoutBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.route = "workspace";
    this.workspaceTitle = this.page.locator('[title^="Workspace"]');
    this.addWorkspaceBtn = this.page.locator('button[title="Add"]');
    this.workspaceList = this.page.locator('[class^="_workspaces_"]');
    this.productSearchTab = this.page.locator('button').filter({ hasText: 'Product search' })
    this.uploadFileTab = this.page.locator('button').filter({ hasText: 'Upload file' })
    this.pasteTextTab = this.page.locator('button').filter({ hasText: 'Paste text' })
    this.productsTable = this.page.locator('div[class^="_grid_"]').nth(1)
    this.productRow = this.productsTable.locator('div[class^="_row_"]')
    this.blockOfSubtotals = this.page.locator('div[class^="_bottomline_"]').nth(1)
    this.subtotalQuantityValue = this.blockOfSubtotals.locator('div[class^="_total_"] > div[class^="_value_"]').nth(0)
    this.subtotalPriceValue = this.blockOfSubtotals.locator('div[class^="_total_"] > div[class^="_value_"]').nth(1)
    this.checkoutBtn = this.page.locator('button').filter({hasText: 'Checkout'})
  }

  async goto(options: {workspaceId?: string}) {
    if (options.workspaceId) {
      // @ts-ignore
      await super.goToPageURL(PageRoutes[this.route](options.workspaceId));
    } else {
      // @ts-ignore
      await super.goToPageURL(PageRoutes[this.route]());
    }

  }
  async loadedPage() {
    await super.loadedElementOfPage(this.workspaceTitle);
  }
        
  async createNewWorkspace() {
    const defaultWorkspaceName = await this.workspaceTitle.innerText()
    await this.addWorkspaceBtn.click();
    let newWorkspaceName = defaultWorkspaceName

    await expect(async () => {
      newWorkspaceName = await this.workspaceTitle.innerText()
      expect(newWorkspaceName).not.toEqual(defaultWorkspaceName);
    }).toPass();
    return newWorkspaceName;
  }

  async choseWayToAddProduct(wayOfAdditionProduct: keyof typeof WAYS_OF_PRODUCT_ADDITION, userPage: Page) {
   switch (wayOfAdditionProduct) {
     case WAYS_OF_PRODUCT_ADDITION[WAYS_OF_PRODUCT_ADDITION.product_search]:
       await this.productSearchTab.click();
       return new ProductSearchPage(userPage)
     case WAYS_OF_PRODUCT_ADDITION[WAYS_OF_PRODUCT_ADDITION.upload_file]:
       await this.uploadFileTab.click()
       break;
     case WAYS_OF_PRODUCT_ADDITION[WAYS_OF_PRODUCT_ADDITION.paste_text]:
       await this.pasteTextTab.click()
       break;
     default:
       return;
   }
  }

  async isContainWorkspace(checkedWorkspace: string) {
    await expect(this.workspaceList).toContainText(checkedWorkspace);
  }

  getCellFromRow(typeCell: CellTypes, row: Locator) {
    switch(typeCell) {
      case "Name":
        return row.locator('div[style="--start: 4; --end: 5;"] > div').locator('div').nth(0)
      case "Brand":
        return row.locator('div[style="--start: 4; --end: 5;"] > div').locator('div').nth(1)
      case "MPN":
        return row.locator('div[class^="_cell_"][class*="_offsetMpn_"]')
      case 'Quantity':
        return row.locator('div[class^="_cell_"][class*="_quantity_"]').getByRole('textbox')
      case "Price":
        return row.locator('div[class^="_cell_"][class*="_price_"]')
      case "Total":
      default:
        return row.locator('div[class^="_currentPrice_"] > div[class^="_cell_"]').last()
    }
  }

  async checkRowsCount(addedProductsCount: number) {
    await expect(this.productsTable).toBeVisible()
    await expect(async () => {
      const rowCount = await this.productRow.count()
      expect(rowCount).toEqual(addedProductsCount + 1);
    }).toPass();
  }

  async checkAddedProducts(products: ProductForAdd[]) {
    logger.info(`checkAddedProducts products ${JSON.stringify(products)}`)
    let i = 1;
    for await (let product of products) {
      const rowLocator = this.productRow.nth(i)
      await expect(this.getCellFromRow("MPN", rowLocator)).toContainText(product.productMpn)
      await expect(this.getCellFromRow("Quantity", rowLocator)).toHaveValue(product.quantity.toFixed())
      await expect(this.getCellFromRow("Price", rowLocator)).toContainText(product.price)
      await expect(this.getCellFromRow("Total", rowLocator)).toContainText(product.total)
      i++
    }
  }

  async getNameAndBrandOfProduct(rowNumberOfProduct: number) {
    const rowLocator = this.productRow.nth(rowNumberOfProduct)
    const nameText = await this.getCellFromRow("Name", rowLocator).textContent()
    const brandText = await this.getCellFromRow("Brand", rowLocator).textContent()
    return {
      brand: brandText.trim(),
      name: nameText.trim()
    }
  }

  async checkTotalAmounts(products: ProductForAdd[]) {
    const subTotal = products.reduce((acc, elm) => {
      acc.totalQuantity = roundFloatPrice(acc.totalQuantity + elm.quantity)
      acc.subtotalPrice = roundFloatPrice(acc.subtotalPrice + parseTotalPrice(elm.total).totalAmount)
      return acc
    }, {totalQuantity: 0, subtotalPrice: 0})
    await expect(this.blockOfSubtotals).toBeVisible();
    const subtotalQuantityValue = await this.subtotalQuantityValue.innerText()
    expect(parseInt(subtotalQuantityValue)).toEqual(subTotal.totalQuantity)
    const subtotalPriceValue = await this.subtotalPriceValue.innerText()
    expect(parseFloatPrice(parsePriceWithCurrencySymbol(subtotalPriceValue))).toEqual(subTotal.subtotalPrice)
  }
  
  async goToCheckoutAndAssertIt(userBrowserContext: BrowserContext) {
    
    const [newUserPage] = await Promise.all([
      userBrowserContext.waitForEvent('page'),
      await this.checkoutBtn.click()
    ]);
    
    await newUserPage.waitForLoadState();

    const checkoutPage = new CheckoutPage(newUserPage)
    await checkoutPage.loadedPage()
    expect(newUserPage.url()).toContain(`${PageRoutes.baseClientURL}/${checkoutPage.route}`)
    return {
      checkoutPage,
      newUserPage
    };
  }
}
