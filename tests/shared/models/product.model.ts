import {Product} from "../types-from-app";
import {enumToArray} from "../utils/helpers";

export interface ProductModel extends Product {
}

export enum DEFAULT_PRODUCT_NUMBERS {
    // @ts-ignore
    "80996040649" = 2, '65626300034' = 3, '65063010098' = 4, '1342051007' = 5,
    // @ts-ignore
    '0730107949' = 6, '0730009547' = 7, '08688' = 8, '106856' = 9
}

export const DEFAULT_PRODUCT_NUMBERS_LIST = enumToArray(DEFAULT_PRODUCT_NUMBERS, 'keys')


