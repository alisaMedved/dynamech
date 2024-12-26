import {BaseApi} from "./base.api";

export class BaseGraphQLApi extends BaseApi {

    async doGqlRequest(parameters: {
        methodName: string;
        url: string;
        headers?: any;
        variables?: any
        query?: string;
    }) {
        const data = {
            query: parameters.query,
            variables: {...parameters.variables},
        };
        const response = await super.doRequest({
                method: 'POST',
                requestUrl: parameters.url,
                options: {
                    headers: parameters.headers,
                    data: {
                        operationName: parameters.methodName,
                        variables: parameters.variables,
                        query: parameters.query,
                    }
                }
            }
        );

        /**
         * Иногда возвращают и описание Error - в целом как все мы знаем это хорошая практика
         * делать кастомные ошибки для API на GraphQL
         * Я вроде их не увидела у Вас - но могу ошибаться и дальше в рамках тестового копать не стала
         * **/
        return {
            //@ts-ignore
            data: response.data[parameters.methodName]
        }
    }
}
