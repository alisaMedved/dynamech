import {Address, Country} from "../types-from-app";

export interface AddressModel extends Address {}



export const DEFAULT_COUNTRIES: Country[] = [
    {
        "name": "Japan",
        "code": "JP",
        "europeanUnion": false,
    },
    {
        "name": "Ukraine",
        "code": "UK",
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
        "name": "Turkey",
        "code": "TR",
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


