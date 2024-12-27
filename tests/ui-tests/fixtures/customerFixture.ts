import {
    Browser,
    BrowserContext,
    type Page,
    request,
    test as base,
} from '@playwright/test';
import { Customer } from '../../shared/controllers/customer.controller';
import { generateUniqueId, readDataFromFile } from '../../shared/utils/helpers';
import { logger } from '../../shared/logs.config';
import { BaseApi } from '../../shared/api/base.api';
import { test_config } from '../../shared/test.config';
import { StorageState } from '../types';
import {LOCALSTORAGE_FIELDS_FOR_AVOID__BANNER} from "../../shared/models/customer.model";

const delay = 3;

type Fixtures = {
    // Fixtures:
    getUserEnvironment: any;
    getAuthFile: any;

    getUnregisteredUser: any;
    getAuthorizedUser: any;
    logoutUser: any;

    // User params:
    authorizedUserAmount: number;
    unregisteredUserAmount: number;
};

interface UserData {
    user: Customer;
    fileUserAuth: string;
    accessToken: string;
    deviceId: string;
}

interface UserEnvironment extends UserData {
    userBrowserContext: BrowserContext;
    userPage: Page;
    dataFromFile: StorageState;
}

export const test = base.extend<Fixtures>({
    /**
     * Create new client
     * scope: 'test'
     */
    unregisteredUserAmount: 1,
    authorizedUserAmount: 1,

    getUnregisteredUser: [
        async ({ unregisteredUserAmount }, use) => {
            let users: any[] = [];
            for (let i = 0; i < unregisteredUserAmount; i++) {
                let user = Customer.getRandomCustomer({});
                users[i] = { ...user, isFake: true };
            }
            await use(users);
        },
        { timeout: 10 * 1000 },
    ],


    getAuthorizedUser: [
        async (
            {
                getAuthFile,
                authorizedUserAmount,
            },
            use,
        ) => {
            let users: UserData[] = new Array(authorizedUserAmount).fill({})
            for await (let user of users) {
                const context = await request.newContext({ storageState: undefined });
                BaseApi.uiTestContext = context;
                let registeredUser = Customer.getRegisteredCustomer();
                const file = getAuthFile(registeredUser.email);

                await Customer.auth({
                    email: registeredUser.email,
                    password: registeredUser.password,
                });

                await context.storageState({ path: file });
                user.user = {...registeredUser}
                user.fileUserAuth = file
            }
            await use(users);
        },
        { timeout: 10 * 1000 },
    ],

    logoutUser: async ({}, use) => {
        await use(async (userBrowserContext: BrowserContext, userPage: Page) => {
            BaseApi.uiTestContext = userBrowserContext.request;
            await Customer.logout();

            await userPage.evaluate(() => window.localStorage.clear());
            await userBrowserContext.close();
            BaseApi.uiTestContext = null;
        });
    },

    getAuthFile: ({}, use) => {
        use((userEmail: string) => {
            const uniqueId = generateUniqueId();
            const formattedId = uniqueId / 100000;
            const authDir = test_config.ui.authDir;
            const outputDir = test.info().project.outputDir;
            const fileName = `${outputDir}/${authDir}/${userEmail}_worker_${formattedId}.json`;
            logger.info(`clientFixture, getAuthFile: get file ${fileName}`);
            return fileName;
        });
    },

    getUserEnvironment: async ({}, use) => {
        await use(async (browser: Browser, userDataArray: UserData[]) => {
            const userEnvironmentArray: UserEnvironment[] = [];
            for await (const userData of userDataArray) {
                const dataFromFile: StorageState = await readDataFromFile(userData.fileUserAuth, true);

                const userBrowserContext = await browser.newContext({
                    storageState: {
                        ...dataFromFile,
                        origins: [
                            {
                                localStorage: [
                                    LOCALSTORAGE_FIELDS_FOR_AVOID__BANNER,
                                ],
                                origin: test_config.ui.baseUrlUI,
                            },
                        ],
                    },
                });
                const userPage = await userBrowserContext.newPage();
                userEnvironmentArray.push({
                    userBrowserContext,
                    userPage,
                    dataFromFile,
                    ...userData,
                });
            }
            return userEnvironmentArray;
        });
    },
});
