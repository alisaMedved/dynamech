import { type Page, type Locator, FrameLocator } from "@playwright/test";
import { BasePage } from "../base.page";
import { PageRoutes } from "../../pageRoutes";
import {logger} from "../../../shared/logs.config";

export class WorkspacePage extends BasePage {
  page: Page;
  route: Exclude<keyof typeof PageRoutes, "prototype">;
  workspaceTitle: Locator;
  addWorkspaceBtn: Locator;
  workspaceList: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.route = "workspace";
    this.workspaceTitle = this.page.locator('[title^="Workspace"]');
    this.addWorkspaceBtn = this.page.locator('button[title="Add"]');
    this.workspaceList = this.page.locator('[class^="_workspaces_"]');
  }

  async goto(options: {workspaceId?: string}) {
    if (options.workspaceId) {
      // @ts-ignore
      await super.goToPageURL(PageRoutes[this.route](options.workspaceId));
    } else {
      // @ts-ignore
      logger.info(`PageRoutes[this.route]() ${PageRoutes[this.route]()}`)
      // @ts-ignore
      await super.goToPageURL(PageRoutes[this.route]());
    }

  }

  async loadedPage() {
    await super.loadedElementOfPage(this.workspaceTitle);
  }
}
