import {DEFAULT_PRODUCT_NUMBERS, DEFAULT_PRODUCT_NUMBERS_LIST, ProductModel} from "../models/product.model";
import {randomElements} from "../utils/helpers";
import {CustomerModel, TEST_EMAIL_DOMAIN} from "../models/customer.model";
import {logger} from "../logs.config";
import {Builder} from "builder-pattern";
import {faker} from "@faker-js/faker";


export class Product {
    public static getRandomProductNumbers(count= 1): Array<keyof typeof DEFAULT_PRODUCT_NUMBERS> {
        //@ts-ignore
        return randomElements(DEFAULT_PRODUCT_NUMBERS_LIST, count)
    }
    public static getRandomProductNumber(): keyof typeof DEFAULT_PRODUCT_NUMBERS {
        //@ts-ignore
        return randomElement(DEFAULT_PRODUCT_NUMBERS_LIST)
    }
    public static productsForAdditionToWorkspace(count: number) {
       return this.getRandomProductNumbers(count).map(productNumber => {
           return this.getRandomProductForAddition({productMpn: productNumber})
       })
    }

    public static getRandomProductForAddition(
        parameters: Partial<ProductModel>,
    ): ProductModel {
        logger.info(`ProductModelController.getRandomProductForAddition start`);
        return Builder<ProductModel>()
            .productMpn(
                parameters.productMpn ??
                this.getRandomProductNumber(),
            )
            .quantity(
                parameters.quantity ??
                faker.number.int({min: 8, max: 12}),
            )
            .build();
    }
}
