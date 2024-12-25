import { Customer } from "../types-from-app";

export interface CustomerModel extends Customer {}

export const DEFAULT_REGISTERED_USER = {
    email: 'jgreenfelder@turner.com',
    password: 'customer'
}

export const TEST_EMAIL_DOMAIN = "@fakertest.com"

export const LOCALSTORAGE_FIELDS_FOR_AVOID__BANNER = {
    name: 'holidayEvents',
    value: JSON.stringify([{
        __typename:"HolidayEvent",
        showAlert:true,
        showOnce:true,
        code:"holiday2025",
        title:"Dear customers!",
        message:"Please note that orders made from December 21st till January 3rd will be shipped to you after January 6th.",
        dateFrom:"2024-12-21T00:00:00+02:00",
        dateTo:"2025-01-03T23:59:59+02:00"}])
}


