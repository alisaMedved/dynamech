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

export type Country = {
  name: string;
  code: string;
  europeanUnion: boolean;
}

export interface Address {
  "country": Country,
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
