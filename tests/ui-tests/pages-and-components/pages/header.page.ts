import {type Page, type Locator, expect} from "@playwright/test";
import {BaseComponent} from "../baseComponent.page";

export interface ProductForAdd {
    price: string,
    total: string,
    productMpn: string,
    quantity: number
}

export class HeaderPage extends BaseComponent {
    page: Page;
    accountMenuTrigger: Locator
    userNameTitle: Locator
    logoutButton: Locator

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.userNameTitle = this.page.locator('[class^="_username_"]')
        this.accountMenuTrigger = this.page.locator('a[class^="ant-dropdown-trigger"]')
        this.logoutButton = this.page.getByText('Sign out')
    }

    async loadedPage() {
        await super.loadedElementOfPage(this.accountMenuTrigger);
    }

    async checkIsAuth(email: string) {
        await expect(this.userNameTitle).toBeVisible()
        await expect(this.userNameTitle).toHaveText(email)
    }

    async logout() {
        await this.accountMenuTrigger.click()
        await this.logoutButton.click()
    }
}
