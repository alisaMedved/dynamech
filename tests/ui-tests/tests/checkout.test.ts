import {test} from "../fixtures/customerFixture";
import {WorkspacePage} from "../pages-and-components/pages/workspace.page";
import {Product} from "../../shared/controllers/product.controller";
import {sleep} from "../../shared/utils/helpers";
import {logger} from "../../shared/logs.config";
import {ProductForAdd} from "../pages-and-components/pages/productSearch.page";
import {Address} from "../../shared/controllers/address.controller";
import {expect} from "@playwright/test";
import {CheckoutPage} from "../pages-and-components/pages/checkout.page";
import {PageRoutes} from "../pageRoutes";


test.describe("check actions on Checkout page", () => {

    test('Checkout workspace with products: check data of products and check europeanUnion Tax', async({
                                                                                 getUserEnvironment,
                                                                                 browser,
                                                                                 logoutUser,
                                                                                 getAuthorizedUser
                                                                             }) => {
        /** Arrange **/
        const [user] = await getAuthorizedUser;
        const [{userPage, userBrowserContext}] = await getUserEnvironment(browser, [user]);
        const productsForAddition = Product.productsForAdditionToWorkspace(3)
        const address = Address.getRandomAddress({})
        logger.info(`productsForAddition ${JSON.stringify(productsForAddition)}`)

        /** Act - Assertion**/
        const workspacePage = new WorkspacePage(userPage);
        await workspacePage.goto({});
        // await workspacePage.createNewWorkspace();
        // const productSearchPage= await workspacePage.choseWayToAddProduct('product_search', userPage);
        // const productsForChecked: ProductForAdd[] = []
        // for await (let productForAddition of productsForAddition) {
        //     await productSearchPage.searchProduct(productForAddition.productMpn)
        //     await productSearchPage.checkSearchedProduct(true)
        //     await productSearchPage.setQuantity(productForAddition.quantity)
        //     const productPrices = await productSearchPage.choseRandomPrice()
        //     logger.info(`productPrices ${JSON.stringify(productPrices)}`)
        //     await productSearchPage.addProductBtn.click()
        //     productsForChecked.unshift({...productPrices, ...productForAddition})
        //     await workspacePage.checkRowsCount(productsForChecked.length)
        // }

            // Слушаем создание новой страницы
            const [newPage] = await Promise.all([
                userBrowserContext.waitForEvent('page'), // Ждём появления новой страницы
                await workspacePage.checkoutBtn.click() // Кликаем на кнопку
            ]);

            // Ждём, пока новая страница загрузится
            await newPage.waitForLoadState();

            const checkoutPage = new CheckoutPage(newPage)
        expect(newPage.url()).toContain(`${PageRoutes.baseClientURL}/${checkoutPage.route}`)

        const selfPickUpLabel = await checkoutPage.getLabelForCheckbox(checkoutPage.selfPickUpCheckbox)
        await selfPickUpLabel.click();
        await checkoutPage.shippingAddressIdSelect.click();
        await checkoutPage.newAddressSelectOption.click();
        await checkoutPage.countrySelect.click()
        await checkoutPage.countrySelect.fill(address.country.name)
        await checkoutPage.countrySelect.blur()

        await checkoutPage.companyName.fill(address.companyName)
        await checkoutPage.companyReg.fill(address.companyReg)
        await checkoutPage.firstName.fill(address.firstName)
        await checkoutPage.lastName.fill(address.lastName)
        await checkoutPage.addressLine.fill(address.addressLine1)
        await checkoutPage.city.fill(address.city)
        await checkoutPage.zip.fill(address.zip)
        await checkoutPage.phone.fill(address.phone)
        await checkoutPage.addressNickname.clear()
        await checkoutPage.billingAddressIsSame.setChecked(true);

        await sleep(10)

        await checkoutPage.paymentMethodBankTransfer.click()

        /** logout **/
        await logoutUser(userBrowserContext, userPage);
    })
})