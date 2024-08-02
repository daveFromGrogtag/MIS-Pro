import estimator from './estimator.js'

const showAddItemButton = document.getElementById('show-add-item-button')
const addItemButton = document.getElementById('add-item')
const addItemCancelButton = document.getElementById('add-item-cancel')

function showAddItem() {
    let addItemSection = document.getElementById('add-item-section')
    addItemSection.classList.remove('hidden')
}
function hideAddItem() {
    document.getElementById('add-item-section').classList.add('hidden')
}

function calculateTotal() {
    const orderMarkup = document.getElementById('order-markup').value
    const orderDiscount = document.getElementById('order-discount').value

    let total = 0
    const lineCosts = document.querySelectorAll('[data-line-item-cost]')
    lineCosts.forEach(lineCost => {
        console.log(lineCost.dataset.lineItemCost);
        total += parseFloat(lineCost.dataset.lineItemCost)
    })
    let totalMarkup = (orderMarkup/100) * total
    let totalMarkedUpPrice = total + totalMarkup
    let totalDiscount = (orderDiscount/100) * totalMarkedUpPrice
    let totalDiscountedPrice = totalMarkedUpPrice - totalDiscount

    // console.log(orderMarkup);
    console.log(totalDiscountedPrice);
}

showAddItemButton.addEventListener('click', () => showAddItem())
addItemButton.addEventListener('click', () => addItem())
addItemCancelButton.addEventListener('click', () => hideAddItem())

