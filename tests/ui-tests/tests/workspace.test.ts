import {test} from "../fixtures/customerFixture";
import {WorkspacePage} from "../pages-and-components/pages/workspace.page";
import {Product} from "../../shared/controllers/product.controller";
import {sleep} from "../../shared/utils/helpers";
import {logger} from "../../shared/logs.config";
import {ProductForAdd} from "../pages-and-components/pages/productSearch.page";


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

    test('Check to add new products in workspace with Product Search', async({
                                                             getUserEnvironment,
                                                             browser,
                                                             logoutUser,
                                                             getAuthorizedUser
                                                         }) => {
        /** Arrange **/
        const [user] = await getAuthorizedUser;
        const [{userPage, userBrowserContext}] = await getUserEnvironment(browser, [user]);
        const productsForAddition = Product.productsForAdditionToWorkspace(3)
        logger.info(`productsForAddition ${JSON.stringify(productsForAddition)}`)

        /** Act - Assertion**/
        const workspacePage = new WorkspacePage(userPage);
        await workspacePage.goto({});
        await workspacePage.createNewWorkspace();
        const productSearchPage= await workspacePage.choseWayToAddProduct('product_search', userPage);
        const productsForChecked: ProductForAdd[] = []
        for await (let productForAddition of productsForAddition) {
            await productSearchPage.searchProduct(productForAddition.productMpn)
            await productSearchPage.checkSearchedProduct(true)
            await productSearchPage.setQuantity(productForAddition.quantity)
            const productPrices = await productSearchPage.choseRandomPrice()
            logger.info(`productPrices ${JSON.stringify(productPrices)}`)
            await productSearchPage.addProductBtn.click()
            productsForChecked.unshift({...productPrices, ...productForAddition})
            await workspacePage.checkRowsCount(productsForChecked.length)
        }
        await workspacePage.checkAddedProducts(productsForChecked)

        await workspacePage.checkTotalAmounts(productsForChecked)
        await sleep(4)

        /** logout **/
        await logoutUser(userBrowserContext, userPage);
    })
})