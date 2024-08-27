const substrateList = {
    "vinyl": {
        "costPerSquareInch": 0.0024034
    },
    "holo-vinyl": {
        "costPerSquareInch": 0.0066450
    }
}

const laminateList = {
    "none": {
        "costPerSquareInch": 0
    },
    "soft-touch": {
        "costPerSquareInch": .0002
    }
}

const pressList = {
    "canon-colorado": {
        "inkCostPerSquareInch": 0.0004,
        "printMode": {
            "cmyk-1-side": {
                "inkCostPerSquareInch":  0.0004
            },
            "cmyk-2-side": {
                "inkCostPerSquareInch":  0.0009
            },
            "cmyk-white": {
                "inkCostPerSquareInch":  0.0009
            }
        },
        "printQuality": {
            "production-gloss": {
                "squareInchesPerHour": 87840
            },
            "high-quality-gloss": {
                "squareInchesPerHour": 61488
            }
        }
    },
    "canon-arizona": {
        "inkCostPerSquareInch": 0.0016,
        "printMode": {
            "cmyk-1-side": {
                "inkCostPerSquareInch":  0.0008
            },
            "cmyk-2-side": {
                "inkCostPerSquareInch":  0.0016
            },
            "cmyk-white": {
                "inkCostPerSquareInch":  0.0017
            }
        },
        "printQuality": {
            "production-gloss": {
                "squareInchesPerHour": 32241
            },
            "high-quality-gloss": {
                "squareInchesPerHour": 22636
            }
        }
    }
}


const burden = {
    "totalPerHour": 160
}


function estimator(width, height, bleed, quantity, substrate, laminate, press, mode, quality) {
    // const pulledMarkUp = parseFloat(document.getElementById('orderMarkup').value) / 100
    // const pulledDiscount = parseFloat(document.getElementById('orderDiscount').value) / 100
    let widthBleed = parseFloat(width) + (parseFloat(bleed) * 2)
    let heightBleed = parseFloat(height) + (parseFloat(bleed) * 2)
    let squareInches = (widthBleed * heightBleed * parseInt(quantity))
    let materialCost = getMaterialCost(substrate, laminate, press) * squareInches
    let laborCost = getTime(press, width, height, quantity, mode, quality).timeTotal * burden.totalPerHour
    
    let totalCost = (materialCost + laborCost)
    return {'materialCost': materialCost, 'squareInches': squareInches, 'laborCost': laborCost, 'totalCost': totalCost}
}

function getMaterialCost(substrate, laminate, press, mode, quality) {
    let substrateCost = substrateList[substrate]["costPerSquareInch"]
    let laminateCost = laminateList[laminate]["costPerSquareInch"]
    let inkCost = pressList[press].printMode[mode].inkCostPerSquareInch
    return substrateCost + laminateCost + inkCost
}

function getTime(press, width, height, quantity, mode, quality) {
    let printTimeTotal = (width * height * quantity) / pressList[press].printQuality[quality].squareInchesPerHour
    
    
    let finishingTimeTotal = 0
    let timeTotal = printTimeTotal + finishingTimeTotal
    return {'printTimeTotal': printTimeTotal, 'finishingTimeTotal': finishingTimeTotal, 'timeTotal': timeTotal}
}

export default estimator

// estimator(1,1,0,1000,"vinyl", "soft-touch", "canon-colorado-quality", .05, .2)
