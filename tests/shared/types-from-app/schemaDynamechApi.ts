export interface ResponseDTO {}

export interface Customer {
  email: string;
  password?: string;
}

export interface CustomerCredentials {
  email: string;
  password: string;
}

export interface Product {
  productMpn: string;
  quantity: number
}

export interface Address {
  "country": {
    "name": string
    "code": string,
    "europeanUnion": boolean,
  },
  "firstName": string,
  "lastName": string,
  "addressLine1": string,
  "city": string,
  "zip": string,
  "phone": string,
  "companyName": string,
  "companyVat": string,
  "companyReg": string,
}
