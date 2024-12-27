import {logger} from "../logs.config";

export function parseFloatPrice(stringPrice: string): number {
    logger.info(`parseFloatPrice stringPrice ${stringPrice}`)
    const res = Math.round(parseFloat(stringPrice.replace(' ', '').replace(',', '')) * 100)/100
    logger.info(`parseFloatPrice res ${res}`)
    return res
}

export function roundFloatPrice(initPrice: number): number {
    logger.info(`roundFloatPrice stringPrice ${initPrice}`)
    const res = Math.round(initPrice * 100)/100
    logger.info(`roundFloatPrice res ${res}`)
    return res
}

export function parsePriceWithCurrencySymbol(input: string): string {
    logger.info(`parsePriceWithCurrencySymbol input ${input}`)
    // Ищет число после '€'
    const priceMatch = input.match(/€[\d,.\s]+/);
    const res = priceMatch ? priceMatch[0].replace('€', '').trim() : '';
    logger.info(`parsePriceWithCurrencySymbol res ${res}`)
    return res
}

export function parseTotalPrice(totalPrice: string) {
    logger.info(`parseTotalPrice totalPrice ${totalPrice}`)
    logger.info(`parseTotalPrice totalAmount ${parseFloatPrice(parsePriceWithCurrencySymbol(totalPrice))}`)
    logger.info(`parseTotalPrice totalCurrency ${totalPrice.slice(0, 1)}`)
    return {
        totalPrice: totalPrice,
        totalAmount: parseFloatPrice(parsePriceWithCurrencySymbol(totalPrice)),
        totalCurrency: totalPrice.slice(0, 1)
    }
}

export function matchQuantityAndPrice(input: string): { quantity: number, price: number } {
    // Ищет число перед 'x'
    const quantityMatch = input.match(/^(\d+)\s*x/);

    const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
    const price = parsePriceWithCurrencySymbol(input)

    logger.info(`matchQuantityAndPrice ${quantity}`)
    logger.info(`matchQuantityAndPrice price ${parseFloatPrice(price)}`)

    return {
        quantity,
        price: parseFloatPrice(price)
    };
}

