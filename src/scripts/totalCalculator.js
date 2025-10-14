function totalCalculator(total, taxRate, shippingCost, markup, discount, taxableTotal=total) {
    total = total?parseFloat(total):0
    taxRate = taxRate?parseFloat(taxRate)/100:0
    shippingCost = shippingCost?parseFloat(shippingCost):0
    markup = markup?parseFloat(markup)/100:0
    discount = discount?parseFloat(discount)/100:0

    let clientTotal = total * (1 + markup)
    let clientTaxableTotal = taxableTotal * (1 + markup)
    let clientShipping =  shippingCost * (1 + markup)
    let clientTax = clientTaxableTotal * taxRate
    let clientSubtotalWithTax = clientTotal + clientTax
    let clientTotalWithTaxAndShipping = clientSubtotalWithTax + clientShipping
    let clientTotalWithDiscount = clientTotalWithTaxAndShipping * (1 - discount)

    let clientTotals = {
        cost: total,
        taxableTotal: taxableTotal,
        shippingCost: shippingCost,
        clientTotal: clientTotal,
        clientShipping: clientShipping,
        clientTax: clientTax,
        clientSubtotalWithTax: clientSubtotalWithTax,
        clientTotalWithTaxAndShipping: clientTotalWithTaxAndShipping,
        clientTotalWithDiscount: clientTotalWithDiscount
    }
    return clientTotals
}

export default totalCalculator