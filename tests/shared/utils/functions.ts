export function parseTotalPrice(totalPrice: string) {
    return {
        totalPrice: totalPrice,
        totalAmount: Math.round(parseFloat(totalPrice.slice(1).replace(' ', '')) * 100)/100,
        totalCurrency: totalPrice.slice(0, 1)
    }
}