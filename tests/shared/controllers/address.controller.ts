import { Builder } from "builder-pattern";
import { faker } from "@faker-js/faker";
import { logger } from "../logs.config";
import {AddressModel, DEFAULT_COUNTRIES} from "../models/address.model";
import {randomElement} from "../utils/helpers";

export class Address {

    public static getRandomAddress(
        parameters: Partial<AddressModel>,
    ): AddressModel {
        return Builder<AddressModel>()
            .country(parameters.country ??
                randomElement(DEFAULT_COUNTRIES)
            )
            .city(
                parameters.city ??
                faker.address.city()
            )
            .addressLine1(
                parameters.addressLine1 ??
                faker.address.streetAddress(true)
            )
            .zip(parameters.zip ??
                parameters.zip ??
                faker.address.zipCode())
            .firstName(
                parameters.firstName ??
                faker.person.firstName()
            )
            .lastName(
                parameters.lastName ??
                faker.person.lastName()
            )
            .companyName(
                parameters.companyName ??
                faker.company.name()
            )
            .companyVat(
                parameters.companyVat ??
                `${faker.string.alpha({ length: 2, casing: 'upper'})}${faker.string.numeric({ length: { min: 8, max: 10 } })}`
    )
            .companyReg(
                parameters.companyReg ??
                'Inc'
            )
            .phone(
                parameters.phone ??
                faker.phone.number({ style: 'international' })
            )
            .build();
    }
}