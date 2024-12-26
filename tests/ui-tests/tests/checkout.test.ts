import {test} from "../fixtures/customerFixture";
import {ProductWithBrandAndName, WorkspacePage} from "../pages-and-components/pages/workspace.page";
import {Product} from "../../shared/controllers/product.controller";
import {randomElement, sleep} from "../../shared/utils/helpers";
import {logger} from "../../shared/logs.config";
import {Address} from "../../shared/controllers/address.controller";
import {newAddressIdSelectOption} from "../pages-and-components/pages/checkout.page";
import {DEFAULT_COUNTRIES} from "../../shared/models/address.model";
import {Country} from "../../shared/types-from-app";


test.describe("check actions on Checkout page", () => {

    const arrayForTest: Country[] = []

    const europeanUnionCountry: Country = randomElement(DEFAULT_COUNTRIES.filter((country) => {
        return country.europeanUnion
    }))

    const notEuropeanUnionCountry: Country = randomElement(DEFAULT_COUNTRIES.filter((country) => {
        return !country.europeanUnion
    }))

    // arrayForTest.push(europeanUnionCountry)
    arrayForTest.push(notEuropeanUnionCountry)

    arrayForTest.forEach((country: Country) => {
        test(`Check products data and tax in Cart for country with flag isEuropeanUnion = ${country.europeanUnion}`, async({
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
            await workspacePage.createNewWorkspace();

            const productSearchPage= await workspacePage.choseWayToAddProduct('product_search', userPage);
            const productsForChecked: ProductWithBrandAndName[] = []

            for await (let productForAddition of productsForAddition) {
                await productSearchPage.searchProduct(productForAddition.productMpn)
                await productSearchPage.checkSearchedProduct(true)
                await productSearchPage.setQuantity(productForAddition.quantity)
                const productPrices = await productSearchPage.choseRandomPrice()
                logger.info(`productPrices ${JSON.stringify(productPrices)}`)
                await productSearchPage.addProductBtn.click()
                productsForChecked.unshift({...productPrices, ...productForAddition, brand: '', name: ''})
                await workspacePage.checkRowsCount(productsForChecked.length)
                const {brand, name} = await workspacePage.getNameAndBrandOfProduct(1)
                productsForChecked[0].brand = brand
                productsForChecked[0].name = name
            }

            const { checkoutPage, newUserPage} = await workspacePage.goToCheckoutAndAssertIt(userBrowserContext);

            await checkoutPage.setCheckboxValue(checkoutPage.billingAddressIsSame, true);
            await checkoutPage.setCheckboxValue(checkoutPage.selfPickUpCheckbox, true);


            await checkoutPage.setSelectValue(checkoutPage.billingAddressIdSelect, newAddressIdSelectOption)
            await checkoutPage.setSelectValue(checkoutPage.countrySelect, address.country.name)

            await checkoutPage.companyName.fill(address.companyName)
            await checkoutPage.firstName.fill(address.firstName)
            await checkoutPage.lastName.fill(address.lastName)
            await checkoutPage.addressLine.fill(address.addressLine1)
            await checkoutPage.city.fill(address.city)
            await checkoutPage.zip.fill(address.zip)
            await checkoutPage.phone.fill(address.phone)
            await checkoutPage.addressNickname.clear()

            await checkoutPage.paymentMethodBankTransfer.setChecked(true);

            await checkoutPage.checkProductInCart(productsForChecked)
            await checkoutPage.checkSubtotalAndTaxInCart(productsForChecked, country.europeanUnion)

            await checkoutPage.placeOrderAndAsserIt(newUserPage);

            /** logout **/
            await logoutUser(userBrowserContext, userPage);
        })
    })
})