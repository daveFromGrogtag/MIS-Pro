import { useState } from 'react';

const CostConverter = () => {
    const [unitType, setUnitType] = useState('sqft');
    const [cost, setCost] = useState('');
    const [result, setResult] = useState('');

    const convertCost = () => {
        const costValue = parseFloat(cost);
        if (isNaN(costValue) || costValue <= 0) {
            setResult('Please enter a valid cost.');
            return;
        }

        let costPerSqIn;
        if (unitType === 'sqft') {
            costPerSqIn = costValue / 144; // 1 square foot = 144 square inches
        } else {
            costPerSqIn = costValue / 1550.0031; // 1 square meter = 1550.0031 square inches
        }

        setResult(`Cost per Square Inch: $${costPerSqIn.toFixed(6)}`);
    };

    return (
        <div className="costConverter">
            <div>
                <h2>Cost / Time Conversion Calculator</h2>
                <label htmlFor="unitType">Select Unit Type:</label>
                <select
                    id="unitType"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value)}
                >
                    <option value="sqft">Cost/Time per Square Foot</option>
                    <option value="sqm">Cost/Time per Square Meter</option>
                </select>

                <label htmlFor="costInput">Enter Cost/Time(Sec.):</label>
                <input
                    type="number"
                    id="costInput"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="Cost or Time"
                    step="0.01"
                />

                <button
                    onClick={convertCost}
                >
                    Calculate Cost/Time per Square Inch
                </button>

                {result && <div>{result}</div>}
            </div>
        </div>
    );
};

export default CostConverter;