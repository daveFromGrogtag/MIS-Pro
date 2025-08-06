import { db } from '../scripts/firebase/init.ts'
import { doc, getDoc } from 'firebase/firestore'
import pressData from './presses.json' assert {type: 'json'}

const burden = {
    "totalPerHour": 175 / 60 / 60
}

export default async function estimator(width, height, bleed, quantity, substrate, laminate, press, mode, quality, cutter) {
    try {
        let subCost = await getItemInfo("substrates", substrate, "costPerSquareInch")
        let subTime = await getItemInfo("substrates", substrate, "timePerSquareInch")
        let lamCost = await getItemInfo("laminates", laminate, "costPerSquareInch")
        let lamTime = await getItemInfo("laminates", laminate, "timePerSquareInch")
        let pressCost = await getItemInfo("presses", press, "costPerSquareInch")
        let pressTime = await getItemInfo("presses", press, "timePerSquareInch")
        let cutCost = await getItemInfo("cutters", cutter, "costPerSquareInch")
        let cutTime = await getItemInfo("cutters", cutter, "timePerSquareInch")


        let widthBleed = parseFloat(width) + (parseFloat(bleed) * 2)
        let heightBleed = parseFloat(height) + (parseFloat(bleed) * 2)
        let squareInches = (widthBleed * heightBleed * parseInt(quantity))
        let materialCost = getMaterialCost(subCost, lamCost, pressCost, mode, quality) * squareInches
        let laborCost = getTime(pressTime, width, height, quantity, mode, quality, cutTime, lamTime).timeTotal * burden.totalPerHour
        let finishingCost = getFinishingCost(width, height, quantity, cutCost)
        let totalTime = getTime(pressTime, width, height, quantity, mode, quality, cutTime, lamTime)['timeTotal']
    
        let totalCost = (materialCost + laborCost + finishingCost)
        console.log({'materialCost': materialCost, 'squareInches': squareInches, 'laborCost': laborCost, 'totalCost': totalCost, 'totalTime': totalTime });
        
        console.log("PRESS INFO");
        console.log(pressData);
        
        return {'materialCost': materialCost, 'squareInches': squareInches, 'laborCost': laborCost, 'totalCost': totalCost, 'totalTime': totalTime }
    } catch (error) {
        console.error(error);
        return {'materialCost': 0, 'squareInches': 0, 'laborCost': 0, 'totalCost': 0, 'totalTime': 0 }
    }
}


async function getItemInfo(itemCollection, itemId, itemField) {
    const docRef = doc(db, itemCollection, itemId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        if (docSnap.data()[itemField]) {
            return parseFloat(docSnap.data()[itemField])
        } else {
            return 0
        }
    } else {
        console.log(`${itemCollection}.${itemId}.${itemField} - No such doc...`);
    }

}

function getMaterialCost(substrate, laminate, press, mode, quality) {
    let substrateCost = substrate
    let laminateCost = laminate
    let inkCost = press
    return substrateCost + laminateCost + inkCost
}

function getFinishingCost(width, height, quantity, cutter) {
    return width * height * quantity * cutter
}

function getTime(press, width, height, quantity, mode, quality, cutter, laminate) {
    let printTimeTotal = (width * height * quantity) * press
    let laminateTime = (laminate == 'none') ? 0 : (width * height * quantity) * laminate
    let cuttingTime  = (width * height * quantity) * cutter
    let finishingTimeTotal = laminateTime + cuttingTime
    let timeTotal = printTimeTotal + finishingTimeTotal
    console.log({'printTimeTotal': printTimeTotal, 'finishingTimeTotal': finishingTimeTotal, 'timeTotal': timeTotal});
    
    return {'printTimeTotal': printTimeTotal, 'finishingTimeTotal': finishingTimeTotal, 'timeTotal': timeTotal}
}

// export default estimator

// estimator(1, 1, .125, 1000, "015Styrene", "none", "canon-colorado-production", "cmyk-1", "good", "colex")
