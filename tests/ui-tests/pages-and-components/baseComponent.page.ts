import { Locator, Page } from "@playwright/test";
import { test_config } from "../../shared/test.config";

export abstract class BaseComponent {
    page: Page;
    public readonly timeForWaitingLoadPage: number =
        test_config.timeoutsForUiTests.timeForWaitingLoadPage;

    protected constructor(page: Page) {
        this.page = page;
    }

    async scroll({ x, y }: { x?: number; y?: number }) {
        await this.page.mouse.wheel(x ?? 0, y ?? 0);
    }

    async setCheckboxValue(checkboxLocator: Locator, value: boolean): Promise<void> {
        const checked = await checkboxLocator.isChecked();
        if (checked !== value) {
            const labelFor = await checkboxLocator.getAttribute('id')
            const labelLocator = this.page.locator(`label[for="${labelFor}"]`)
            await labelLocator.click()
        }
    }

    async setSelectValue(selectLocator: Locator, labelOption: string): Promise<void> {
        await selectLocator.click()
        const reg = new RegExp(labelOption, "i");
        const selectOptionLocator = selectLocator.getByText(reg)
        await selectOptionLocator.click()
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

    getClassName() {
        return this.constructor.name;
    }

    abstract loadedPage(): Promise<void>;
}
