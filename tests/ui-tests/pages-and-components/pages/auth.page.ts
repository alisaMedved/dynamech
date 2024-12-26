// await page.goto('https://aqatesttask.dynamech.io/business-v2/login');
// await page.getByPlaceholder('Email').click();
// await page.getByPlaceholder('Email').fill('jgreenfelder@turner.com');
// await page.getByLabel('Password').click();
// await page.getByLabel('Password').click();
// await page.getByLabel('Password').fill('customer');
// await page.getByRole('button', { name: 'Login' }).click();

import {type Page, type Locator, expect} from "@playwright/test";
import { BasePage } from "../base.page";
import { PageRoutes } from "../../pageRoutes";
import {matchQuantityAndPrice, parseFloatPrice, parsePriceWithCurrencySymbol} from "../../../shared/utils/functions";
import {ConfirmationPage} from "./confirmation.page";
import {logger} from "../../../shared/logs.config";
import {ProductWithBrandAndName, WorkspacePage} from "./workspace.page";


export class AuthPage extends BasePage {
    page: Page;
    route: Exclude<keyof typeof PageRoutes, "prototype">;
    emailInput: Locator;
    passwordInput: Locator;
    loginBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.route = "auth";
        this.emailInput = this.page.locator('input[id="loginForm_email"]')
        this.passwordInput = this.page.locator('input[id="loginForm_password"]')
        this.loginBtn = this.page.getByRole('button', { name: 'Login' })
    }

    async goto() {
        // @ts-ignore
        await super.goToPageURL(PageRoutes[this.route]);

    }

    async loadedPage() {
        await super.loadedElementOfPage(this.loginBtn);
    }

    async loginAndGoToWorkspace(user, userPage) {
        await this.emailInput.fill(user.email)
        await this.passwordInput.fill(user.password)
        const workspacePage = new WorkspacePage(userPage)
        await this.loginBtn.click()
        await workspacePage.loadedPage()
        return workspacePage;
    }

}
