import {DEFAULT_PRODUCT_NUMBERS_LIST, ProductModel} from "../models/product.model";
import {randomElement, randomElements} from "../utils/helpers";
import {logger} from "../logs.config";
import {Builder} from "builder-pattern";
import {faker} from "@faker-js/faker";


export class Product {
    public static getRandomProductNumbers(count= 1): Array<string> {
        return randomElements(DEFAULT_PRODUCT_NUMBERS_LIST, count)
    }
    public static getRandomProductNumber(): string {
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
        return Builder<ProductModel>()
            .productMpn(
                parameters.productMpn ??
                this.getRandomProductNumber(),
            )
            .quantity(
                parameters.quantity ??
                faker.number.int({min: 2, max: 5}),
            )
            .build();
    }
}
