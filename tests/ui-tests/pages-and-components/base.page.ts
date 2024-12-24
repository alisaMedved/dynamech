import { Locator, Page } from "@playwright/test";
import { test_config } from "../../shared/test.config";
import { PageRoutes } from "../pageRoutes";

export abstract class BasePage {
  page: Page;
  public readonly timeForWaitingLoadPage: number =
    test_config.timeoutsForUiTests.timeForWaitingLoadPage;

  protected constructor(page: Page) {
    this.page = page;
  }

  async reload() {
    await this.page.reload();
    await this.loadedPage();
  }

  getURL() {
    return this.page.url();
  }

  async scroll({ x, y }: { x?: number; y?: number }) {
    await this.page.mouse.wheel(x ?? 0, y ?? 0);
  }

  async goToPageURL(urlPage: string) {
    await this.page.goto(urlPage);
    await this.loadedPage();
  }

  async loadedElementOfPage(element: Locator) {
    await element.waitFor({
      state: "visible",
      timeout: this.timeForWaitingLoadPage,
    });
  }

  async loadedElementArrayOfPage(elementArray: Locator[]) {
    for (const element of elementArray) {
      await this.loadedElementOfPage(element);
    }
  }

  abstract loadedPage(): Promise<void>;
  abstract route: Exclude<keyof typeof PageRoutes, "prototype">;
}
