export function parseTotalPrice(totalPrice: string) {
    return {
        totalPrice: totalPrice,
        totalAmount: parseFloatPrice(totalPrice),
        totalCurrency: totalPrice.slice(0, 1)
    }
}

export function parseFloatPrice(stringPrice: string): number {
    return Math.round(parseFloat(stringPrice.slice(1).replace(' ', '')) * 100)/100
}