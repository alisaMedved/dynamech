import {Page} from "@playwright/test";
import { test_config } from "../../shared/test.config";
import { PageRoutes } from "../pageRoutes";
import {BaseComponent} from "./baseComponent.page";

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

  abstract route: Exclude<keyof typeof PageRoutes, "prototype">;
}
