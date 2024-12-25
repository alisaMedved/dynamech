import {test} from "../fixtures/customerFixture";
import {WorkspacePage} from "../pages-and-components/pages/workspace.page";
import {Product} from "../../shared/controllers/product.controller";
import {sleep} from "../../shared/utils/helpers";
import {logger} from "../../shared/logs.config";


test.describe("check actions with workspaces", () => {

    test('Check create new workspace', async ({
                                                                                                   getUserEnvironment,
                                                                                                   browser,
                                                                                                   logoutUser,
                                                                                                   getAuthorizedUser}) => {
        /** Arrange **/
        const [user] = await getAuthorizedUser;
        const [{userPage, userBrowserContext}] = await getUserEnvironment(browser, [user]);

        /** Act **/
        const workspacePage = new WorkspacePage(userPage);
        await workspacePage.goto({});
        const newWorkspaceName = await workspacePage.createNewWorkspace();

        /** Assertion **/
        await workspacePage.isContainWorkspace(newWorkspaceName)

        /** logout **/
        await logoutUser(userBrowserContext, userPage);
    });

    test('Check to add new products in workspace', async({
                                                             getUserEnvironment,
                                                             browser,
                                                             logoutUser,
                                                             getAuthorizedUser
                                                         }) => {
        /** Arrange **/
        const [user] = await getAuthorizedUser;
        const [{userPage, userBrowserContext}] = await getUserEnvironment(browser, [user]);
        const productsForAddition = Product.productsForAdditionToWorkspace(3)
        logger.info(`productNumbers[0] ${JSON.stringify(productsForAddition)}`)

        /** Act - Assertion**/
        const workspacePage = new WorkspacePage(userPage);
        await workspacePage.goto({});
        await workspacePage.createNewWorkspace();
        const productSearchPage= await workspacePage.choseWayToAddProduct('product_search', userPage);
        await productSearchPage.searchProduct(productsForAddition[0].productMpn)
        await productSearchPage.checkSearchedProduct(true)
        await productSearchPage.setQuantity(productsForAddition[0].quantity)
        const productPrices = await productSearchPage.choseRandomPrice()
        await productSearchPage.addProductBtn.click()

        await workspacePage.checkAddedProducts({...productPrices, ...productsForAddition[0]})

        await sleep(4)
        /** logout **/
        // await logoutUser(userBrowserContext, userPage);
    })
})