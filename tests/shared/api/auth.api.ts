import {BaseApi} from "./base.api";
import {test_config} from "../test.config";
import {CustomerCredentials} from "../types-from-app";

export class AuthApi extends BaseApi {
    readonly baseUrl = test_config.http.dynamechUrlHttp;

    async loginCustomer(user: CustomerCredentials) {
        const response = await super.doRequest({
            method: "POST",
            requestUrl: `${this.baseUrl}/customer/auth`,
            options: {
                data: user, headers: {
                    withCredentials: 'true',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin'

                }
            },
        });
        return response;
    }

    async logoutCustomer() {
        return await super.doRequest({
            method: "POST",
            requestUrl: `${this.baseUrl}/customer/logout`,
            options: {
                headers: {
                    withCredentials: 'true',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin'

                }
            }
        })
    }
}
