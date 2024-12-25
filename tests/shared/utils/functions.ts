export function parseFloatPrice(stringPrice: string): number {
    return Math.round(parseFloat(stringPrice.replace(' ', '').replace(',', '')) * 100)/100
}

export function parsePriceWithCurrencySymbol(input: string): string {
    // Ищет число после '€'
    const priceMatch = input.match(/€[\d,.\s]+/);
    return priceMatch ? priceMatch[0].replace('€', '').trim() : '';
}

export function parseTotalPrice(totalPrice: string) {
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

    return {
        quantity,
        price: parseFloatPrice(price)
    };
}

