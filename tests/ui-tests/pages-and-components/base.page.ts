import {Cookie, Page} from "@playwright/test";
import { test_config } from "../../shared/test.config";
import { PageRoutes } from "../pageRoutes";
import {BaseComponent} from "./baseComponent.page";
import {logger} from "../../shared/logs.config";
import {StorageState} from "../types";

export abstract class BasePage extends BaseComponent {
  page: Page;
  public readonly timeForWaitingLoadPage: number =
    test_config.timeoutsForUiTests.timeForWaitingLoadPage;

  protected constructor(page: Page) {
    super(page);
    this.page = page;
  }

  async reload() {
    await this.page.reload();
    await this.loadedPage();
  }

  getURL() {
    return this.page.url();
  }

  async goToPageURL(urlPage: string) {
    await this.page.goto(urlPage);
    await this.loadedPage();
  }

  async logCookie(): Promise<{ storeFromPage: StorageState; cookiesFromPage: Array<Cookie> }> {
    const storeFromPage: StorageState = await this.page.context().storageState();
    const cookiesFromPage = await this.page.context().cookies();
    logger.info(`${this.getClassName()} this.page.context().storageState() ${JSON.stringify(storeFromPage)}`);
    logger.info(`${this.getClassName()} this.page.context().cookies() ${JSON.stringify(cookiesFromPage)}`);
    return { storeFromPage, cookiesFromPage };
  }

  async isAuth(): Promise<boolean> {
    const { storeFromPage } = await this.logCookie();
    if (storeFromPage && storeFromPage?.cookies && Array.isArray(storeFromPage?.cookies)) {
      return storeFromPage.cookies.some((cookie) => cookie.name === 'customer_token_hp') &&
          storeFromPage.cookies.some((cookie) => cookie.name === 'customer_token_s')
    }
    return false;
  }

  abstract route: Exclude<keyof typeof PageRoutes, "prototype">;
}
