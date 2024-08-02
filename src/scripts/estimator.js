const substrateList = {
    "vinyl": {
        "costPerSqareInch": 0.00565843621399177
    },
    "holo-vinyl": {
        "costPerSqareInch": 0.00665843621399177
    }
}

const laminateList = {
    "none": {
        "costPerSqareInch": 0
    },
    "soft-touch": {
        "costPerSqareInch": .5
    }
}

const pressList = {
    "canon-colorado-production": {
        "inkCostPerSqareInch": 0
    },
    "canon-colorado-quality": {
        "inkCostPerSqareInch": 0.1
    },
    "canon-arizona-production": {
        "inkCostPerSqareInch": 0
    },
    "canon-arizona-quality": {
        "inkCostPerSqareInch": 0
    }
}


function estimator(width, height, bleed, quantity, substrate, laminate, press, discount, markup) {
    const pulledMarkUp = parseFloat(document.getElementById('order-markup').value) / 100
    const pulledDiscount = parseFloat(document.getElementById('order-discount').value) / 100
    let widthBleed = parseFloat(width) + (parseFloat(bleed) * 2)
    console.log(widthBleed);
    let heightBleed = parseFloat(height) + (parseFloat(bleed) * 2)
    console.log(heightBleed);
    let squareInches = (widthBleed * heightBleed * parseInt(quantity))
    let materialCost = getMaterialCost(substrate, laminate, press) * squareInches
    let laborCost = 0
    let totalCost = ((materialCost + laborCost) + ((materialCost + laborCost) * pulledMarkUp)) - (((materialCost + laborCost) + ((materialCost + laborCost) * pulledMarkUp)) * pulledDiscount)
    return {'materialCost': materialCost, 'squareInches': squareInches, 'laborCost': laborCost, 'totalCost': totalCost}
}

function getMaterialCost(substrate, laminate, press) {
    let substrateCost = substrateList[substrate]["costPerSqareInch"]
    let laminateCost = laminateList[laminate]["costPerSqareInch"]
    let inkCost = pressList[press]["inkCostPerSqareInch"]
    return substrateCost + laminateCost + inkCost
}

function getTimeCosts(press) {

}

export default estimator

// estimator(1,1,0,1000,"vinyl", "soft-touch", "canon-colorado-quality", .05, .2)
