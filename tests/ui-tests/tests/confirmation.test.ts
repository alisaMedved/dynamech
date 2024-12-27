import {test} from "../fixtures/customerFixture";
import {ProductWithBrandAndName, WorkspacePage} from "../pages-and-components/pages/workspace.page";
import {Product} from "../../shared/controllers/product.controller";
import {randomElement, sleep} from "../../shared/utils/helpers";
import {logger} from "../../shared/logs.config";
import {Address} from "../../shared/controllers/address.controller";
import {newAddressIdSelectOption} from "../pages-and-components/pages/checkout.page";
import {DEFAULT_COUNTRIES} from "../../shared/models/address.model";
import {Country} from "../../shared/types-from-app";
import {ShoppingCartPage} from "../pages-and-components/components/shoppingCart.page";
import {OrderTotalsPage} from "../pages-and-components/components/orderTotals.page";

test.describe('Confirmation page', () => {
    /**
     * Почему mode: 'serial'? Ответ в readme в разделе ## Fixture
     */
    test.describe.configure({ mode: 'serial', retries: 1 })

    const arrayForTest: {country: Country, isSelfPickup: boolean}[] = []

    const europeanUnionCountries = DEFAULT_COUNTRIES.filter((country) => {
        return country.europeanUnion
    })
    const notEuropeanUnionCountries = DEFAULT_COUNTRIES.filter((country) => {
        return !country.europeanUnion
    })

    arrayForTest.push({country: randomElement(europeanUnionCountries), isSelfPickup: true})
    arrayForTest.push({country: randomElement(notEuropeanUnionCountries), isSelfPickup: true})

    arrayForTest.forEach((testData) => {
        test(`Check products data and prices in ConfirmationPage for isEuropeanUnionCountry = ${testData.country.europeanUnion} and isSelfPickup = true`, async({
                                                                                                                                                                                          getUserEnvironment,
                                                                                                                                                                                          browser,
                                                                                                                                                                                          logoutUser,
                                                                                                                                                                                          getAuthorizedUser
                                                                                                                                                                                      }) => {
            /** Arrange **/
            const [user] = await getAuthorizedUser;
            const [{userPage, userBrowserContext}] = await getUserEnvironment(browser, [user]);
            const productsForAddition = Product.productsForAdditionToWorkspace(3)
            const address = Address.getRandomAddress({country: testData.country})
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
            await checkoutPage.setCheckboxValue(checkoutPage.selfPickUpCheckbox, testData.isSelfPickup);


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

            /** костыль - статическое ожидание - ждем когда обновится вся информация.
             * Можно и без костыля и с элегантным решением.
             * Но для того, чтобы выбрать лучшее из элегантных решений и его воплотить не хватает
             * погруженности в контекст проекта.
             * **/
            await sleep(5)

            await checkoutPage.placeOrderAndAsserIt(newUserPage, testData.isSelfPickup);

            const shoppingCartPage = new ShoppingCartPage(newUserPage)
            await shoppingCartPage.checkProductInCart(productsForChecked)

            const orderTotals = new OrderTotalsPage(newUserPage)
            await orderTotals.checkOrderTotals(productsForChecked, address.country.europeanUnion, testData.isSelfPickup)

            /** logout **/
            await logoutUser(userBrowserContext, userPage);
        })
    })

})





