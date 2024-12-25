export function parseProductDetails(input: string): { price: string; total: string } {
    const priceMatch = input.match(/Price:([€\d.]+)/);
    const totalMatch = input.match(/Total:([€\d.]+)/);

    return {
        price: priceMatch ? priceMatch[1] : '',
        total: totalMatch ? totalMatch[1] : '',
    };
}