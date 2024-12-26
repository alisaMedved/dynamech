import {type Page, type Locator} from "@playwright/test";
import { BasePage } from "../base.page";
import { PageRoutes } from "../../pageRoutes";


export class ConfirmationPage extends BasePage {
    page: Page;
    route: Exclude<keyof typeof PageRoutes, "prototype">;
    orderIsGetTitle: Locator

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.route = "confirmation";
        this.orderIsGetTitle = this.page.getByTestId('confirmation-title')
       }

    async goto(options: {orderId: string}) {
        // @ts-ignore
        await super.goToPageURL(PageRoutes[this.route](options.orderId));
    }

    async loadedPage() {
        await super.loadedElementOfPage(this.orderIsGetTitle);
    }

}
