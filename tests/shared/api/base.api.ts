import { APIRequestContext, request } from "@playwright/test";
import { logger } from "../logs.config";

type RequestType = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export class BaseApi {
  public static uiTestContext: APIRequestContext | null = null;

  async doRequest({
                    method,
    options,
    requestUrl,
  }: {
    method: RequestType;
    requestUrl: string;
    options: {
      headers?: any;
      params?: any;
      data?: any;
    };
  }) {
    const context = BaseApi.uiTestContext
      ? BaseApi.uiTestContext
      : await request.newContext();
    logger.info(
      `${method} request: requestUrl = ${requestUrl} : options = ${JSON.stringify(
        options,
      )}`,
    );
      let response = await context[method.toLowerCase()](requestUrl, options);
      logger.info(JSON.stringify(response))
    const status = response.status();
    let responseJSON = {}
    if (status !== 204) {
      responseJSON = await response.json();
    }
      const responseString = JSON.stringify(responseJSON);
      logger.info(
          `${method} request: requestUrl = ${requestUrl} : status = ${status} : responseJSON = ${responseString.length <= 300 ? responseString : "too big response"}`,
      );
    return {
      response: responseJSON,
      status: status,
    };
  }
}
