import {test} from "../fixtures/customerFixture";
import {WorkspacePage} from "../pages-and-components/pages/workspace.page";
import {expect} from "@playwright/test";


test.describe("check actions with workspaces", () => {

    test('Check create new workspace', async ({
                                                                                                   getUserEnvironment,
                                                                                                   browser,
                                                                                                   logoutUser,
                                                                                                   getAuthorizedUser
                                                                                               }) => {
        /** Arrange **/
        const [user] = await getAuthorizedUser;
        const [{userPage, userBrowserContext}] = await getUserEnvironment(browser, [user]);

        /** Act - Assertion **/
        const workspacePage = new WorkspacePage(userPage);
        await workspacePage.goto({});
        const defaultWorkspaceName = await workspacePage.workspaceTitle.innerText()
        await workspacePage.addWorkspaceBtn.click();
        let newWorkspaceName = defaultWorkspaceName
        await expect(async () => {
            newWorkspaceName = await workspacePage.workspaceTitle.innerText()
            expect(newWorkspaceName).not.toEqual(defaultWorkspaceName);
        }).toPass();
        await expect(workspacePage.workspaceList).toContainText(newWorkspaceName);

        /** logout **/
        await logoutUser(userBrowserContext, userPage);
    });
})