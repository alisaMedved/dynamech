import {type Page, type Locator, expect} from "@playwright/test";
import { BasePage } from "../base.page";
import { PageRoutes } from "../../pageRoutes";
import {ConfirmationPage} from "./confirmation.page";

export const newAddressIdSelectOption = 'New Address';

export class CheckoutPage extends BasePage {
    page: Page;
    route: Exclude<keyof typeof PageRoutes, "prototype">;
    selfPickUpCheckbox: Locator;
    billingAddressIsSame: Locator;

    billingAddressIdSelect: Locator;
    countrySelect: Locator;

    firstName: Locator;
    lastName: Locator;
    companyName: Locator;

    addressLine: Locator;
    city: Locator;
    zip: Locator;
    phone: Locator;
    addressNickname: Locator;

    paymentMethodBankTransfer: Locator;
    submitBtn: Locator;

    shippingError: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.route = "checkout";
        this.billingAddressIsSame = this.page.getByTestId('billing-address-same-as-shipping')
        this.selfPickUpCheckbox = this.page.getByTestId('checkbox')

        this.billingAddressIdSelect = this.page.getByTestId('billing-address-id').or(this.page.getByTestId('shipping-address-id'))
        this.countrySelect = this.page.getByTestId('checkout[shipping-address][address-country]')

        this.firstName = this.page.locator('input[name="checkout[billing-address][first-name]"]').or(this.page.locator('input[name="checkout[shipping-address][first-name]"]'))
        this.lastName = this.page.locator('input[name="checkout[billing-address][last-name]"]').or(this.page.locator('input[name="checkout[shipping-address][last-name]"]'))
        this.companyName = this.page.locator('input[name="checkout[billing-address][company]"]').or(this.page.locator('input[name="checkout[shipping-address][company]"]'))

        this.addressLine = this.page.locator('input[name="checkout[billing-address][address-line1]"]').or(this.page.locator('input[name="checkout[shipping-address][address-line1]"]'))
        this.city = this.page.locator('input[name="checkout[billing-address][city]"]').or(this.page.locator('input[name="checkout[shipping-address][city]"]'))
        this.zip = this.page.locator('input[name="checkout[billing-address][zip]"]').or(this.page.locator('input[name="checkout[shipping-address][zip]"]'))
        this.phone = this.page.locator('input[name="checkout[billing-address][phone]"]').or(this.page.locator('input[name="checkout[shipping-address][phone]"]'))
        this.addressNickname = this.page.locator('input[name="checkout[billing-address][nickname]"]').or(this.page.locator('input[name="checkout[shipping-address][nickname]"]'))

        this.paymentMethodBankTransfer = this.page.locator('input[name="checkout[payment-method][payment-bank]"]')

        this.submitBtn = this.page.getByTestId('invoice-checkout-submit').nth(1)

        this.shippingError = this.page.getByTestId('shipping-methods')
    }

    async goto(options: {workspaceId: string}) {
        // @ts-ignore
        await super.goToPageURL(PageRoutes[this.route](options.workspaceId));

    }

    async loadedPage() {
        await super.loadedElementOfPage(this.submitBtn);
    }

    async placeOrderAndAsserIt(userPage: Page, isSuccessPlacingOrder: boolean) {

        if (isSuccessPlacingOrder) {
            const confirmationPage = new ConfirmationPage(userPage)
            await this.submitBtn.click();
            await confirmationPage.loadedPage()
            expect(userPage.url()).toContain(`${PageRoutes.baseClientURL}/${this.route}/${confirmationPage.route}`)
            return confirmationPage;
        } else {
            const elementBoundingBox = await this.shippingError.boundingBox();
            await this.submitBtn.click();
            await expect(this.shippingError).toBeVisible()
            expect(elementBoundingBox).not.toBeNull();
        }

    }

}
