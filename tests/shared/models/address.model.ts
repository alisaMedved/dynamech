import { Address } from "../types-from-app";

export interface AddressModel extends Address {}

export const DEFAULT_COUNTRIES = [
    {
        "name": "Georgia",
        "code": "GE",
        "europeanUnion": false,
    },
    {
        "name": "Russia",
        "code": "RU",
        "europeanUnion": false,
    },
    {
        "name": "France",
        "code": "FR",
        "europeanUnion": true,
    },
    {
        "name": "Spain",
        "code": "ES",
        "europeanUnion": true,
    },
    {
        "name": "Belarus",
        "code": "BY",
        "europeanUnion": false,
    },
    {
        "name": "Portugal",
        "code": "PT",
        "europeanUnion": true,
    },
    {
        "name": "Uzbekistan",
        "code": "UZ",
        "europeanUnion": false,
    },
]


