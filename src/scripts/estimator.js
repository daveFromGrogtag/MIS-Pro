
// const substrateList = {
//     "white_vinyl": {
//         "costPerSquareInch": 0.0024034
//     },
//     "holo_vinyl": {
//         "costPerSquareInch": 0.0066450
//     },
//     "foam_core": {
//         "costPerSquareInch": 0.0029
//     },
//     "ceramic_tile": {
//         "costPerSquareInch": 0.03125
//     }
// }

// const laminateList = {
//     "none": {
//         "costPerSquareInch": 0,
//         "squareInchesPerHour": 0
//     },
//     "soft-touch": {
//         "costPerSquareInch": .002,
//         "squareInchesPerHour": 345600
//     },
//     "gloss": {
//         "costPerSquareInch": .003,
//         "squareInchesPerHour": 345600
//     }
// }

// const pressList = {
//     "canon-colorado-production": {
//         "inkCostPerSquareInch": 0.0004,
//         "printMode": {
//             "cmyk-1-side": {
//                 "inkCostPerSquareInch":  0.0004
//             },
//             "cmyk-2-side": {
//                 "inkCostPerSquareInch":  0.0009
//             },
//             "cmyk-white": {
//                 "inkCostPerSquareInch":  0.0009
//             }
//         },
//         "printQuality": {
//             "production-gloss": {
//                 "squareInchesPerHour": 87840
//             },
//             "high-quality-gloss": {
//                 "squareInchesPerHour": 61488
//             }
//         }
//     },
//     "canon-arizona-production": {
//         "inkCostPerSquareInch": 0.0016,
//         "printMode": {
//             "cmyk-1-side": {
//                 "inkCostPerSquareInch":  0.0008
//             },
//             "cmyk-2-side": {
//                 "inkCostPerSquareInch":  0.0016
//             },
//             "cmyk-white": {
//                 "inkCostPerSquareInch":  0.0017
//             }
//         },
//         "printQuality": {
//             "production-gloss": {
//                 "squareInchesPerHour": 32241
//             },
//            "high-quality-gloss": {
//                 "squareInchesPerHour": 22636
//             }
//         }
//     }
// }

// const cutterList = {
//     'none': {
//         'costPerSquareInch': 0,
//         'squareInchesPerHour': 0
//     },
//     'graptec-fc9000': {
//         'costPerSquareInch': 0.001,
//         'squareInchesPerHour': 61488
//     }
// } 

const burden = {
    "totalPerHour": 175
}

function estimator(width, height, bleed, quantity, substrate, laminate, press, mode, quality, cutter) {
    try {
        // const pulledMarkUp = parseFloat(document.getElementById('orderMarkup').value) / 100
        // const pulledDiscount = parseFloat(document.getElementById('orderDiscount').value) / 100
        let widthBleed = parseFloat(width) + (parseFloat(bleed) * 2)
        let heightBleed = parseFloat(height) + (parseFloat(bleed) * 2)
        let squareInches = (widthBleed * heightBleed * parseInt(quantity))
        let materialCost = getMaterialCost(substrate, laminate, press, mode, quality) * squareInches
        let laborCost = getTime(press, width, height, quantity, mode, quality, cutter, laminate).timeTotal * burden.totalPerHour
        let finishingCost = getFinishingCost(width, height, quantity, cutter)
        let totalTime = getTime(press, width, height, quantity, mode, quality, cutter, laminate).timeTotal
    
        let totalCost = (materialCost + laborCost + finishingCost)
        return {'materialCost': materialCost, 'squareInches': squareInches, 'laborCost': laborCost, 'totalCost': totalCost, 'totalTime': totalTime }
    } catch (error) {
        console.error(error);
        console.log(width, height, bleed, quantity, substrate, laminate, press, mode, quality, cutter)
        return {'materialCost': 0, 'squareInches': 0, 'laborCost': 0, 'totalCost': 0, 'totalTime': 0 }
    }
}

function getMaterialCost(substrate, laminate, press, mode, quality) {
    let substrateCost = substrateList[substrate]["costPerSquareInch"]
    let laminateCost = laminateList[laminate]["costPerSquareInch"]
    // let inkCost = pressList[press].printMode[mode].inkCostPerSquareInch
    let inkCost = pressList[press]["costPerSquareInch"]
    return substrateCost + laminateCost + inkCost
}

function getFinishingCost(width, height, quantity, cutter) {
    return width * height * quantity * cutterList[cutter].costPerSquareInch
}

function getTime(press, width, height, quantity, mode, quality, cutter, laminate) {
    let printTimeTotal = (width * height * quantity) / pressList[press].printQuality[quality].squareInchesPerHour
    let laminateTime = (laminate == 'none') ? 0 : (width * height * quantity) / laminateList[laminate].squareInchesPerHour
    let cuttingTime  = cutterList[cutter].squareInchesPerHour ? (width * height * quantity) / cutterList[cutter].squareInchesPerHour : 0
    let finishingTimeTotal = laminateTime + cuttingTime
    let timeTotal = printTimeTotal + finishingTimeTotal
    return {'printTimeTotal': printTimeTotal, 'finishingTimeTotal': finishingTimeTotal, 'timeTotal': timeTotal}
}

export default estimator

// estimator(1,1,0,1000,"vinyl", "soft-touch", "canon-colorado-quality", .05, .2)
