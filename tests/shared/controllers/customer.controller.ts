import { Builder } from "builder-pattern";
import { faker } from "@faker-js/faker";
import {CustomerModel, DEFAULT_REGISTERED_USER, TEST_EMAIL_DOMAIN} from "../models/customer.model";
import { logger } from "../logs.config";
import {DynamechApi} from "../api/dynamech.api";
import {CustomerCredentials} from "../types-from-app";

export class Customer {

  public static getRandomCustomer(
    parameters: Partial<CustomerModel>,
  ): CustomerModel {
    logger.info(`CustomerController.getRandomCustomer start`);
    return Builder<CustomerModel>()
      .email(
        parameters.email ??
          faker.internet.email({
            provider: TEST_EMAIL_DOMAIN,
          }),
      )
      .build();
  }

    public static getRegisteredCustomer(): CustomerModel {
        logger.info(`CustomerController.getRegisteredCustomer start`);
        return Builder<CustomerModel>()
            .email(DEFAULT_REGISTERED_USER.email)
            .password(DEFAULT_REGISTERED_USER.password)
            .build();
    }

    public static async auth(customerCredentials: CustomerCredentials): Promise<{ response: any; status: any }> {
      const dynamechApi = new DynamechApi()
      return await dynamechApi.loginCustomer(customerCredentials)
    }

    public static async logout() {
        const dynamechApi = new DynamechApi()
        return await dynamechApi.logoutCustomer()
    }
}
