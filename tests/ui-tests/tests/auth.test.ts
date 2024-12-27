import {test} from "../fixtures/customerFixture";
import {AuthPage} from "../pages-and-components/pages/auth.page";
import {Customer} from "../../shared/controllers/customer.controller";
import {expect} from "@playwright/test";
import {HeaderPage} from "../pages-and-components/components/header.page";
import {LOCALSTORAGE_FIELDS_FOR_AVOID__BANNER} from "../../shared/models/customer.model";
import {test_config} from "../../shared/test.config";
import {BaseApi} from "../../shared/api/base.api";


test.describe("Auth tests", () => {

    test('Check auth: positive case', async ({
                                                  browser,
                                                  }) => {
        /** Arrange **/
        const userBrowserContext = await browser.newContext({
            storageState: {
                cookies: [],
                origins: [
                    {
                        localStorage: [
                            LOCALSTORAGE_FIELDS_FOR_AVOID__BANNER,
                        ],
                        origin: test_config.ui.baseUrlUI,
                    },
                ],
            },
        })
        const userPage = await userBrowserContext.newPage();
        const user = Customer.getRegisteredCustomer()

        /** Act **/
        const authPage = new AuthPage(userPage);
        await authPage.goto();
        const workspacePage = await authPage.loginAndGoToWorkspace(user, userPage)


        /** Assertion **/
        const headerPage = new HeaderPage(userPage)
        await headerPage.checkIsAuth(user.email)

        /** Эта проверка не годится так, как она не по интерфейсу страницы проверяет,
         * ну если только нету специального запроса к такой проверке в тесте.
         * Это больше для демонстрации метода BaseComponent.isAuth() - порой он очень удобен))
         * **/
        const isHasAuthorizedUserCookie =  await workspacePage.isAuth()
        expect(isHasAuthorizedUserCookie).toBeTruthy()

        /** logout **/
        await headerPage.logout()
        await userBrowserContext.close();
        BaseApi.uiTestContext = null;
    });

})