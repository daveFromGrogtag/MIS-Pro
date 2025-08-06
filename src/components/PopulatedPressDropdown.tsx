import { useState, useEffect } from "react"
import pressData from './presses.json' assert {type: 'json'}

const PopulatedPressDropdown = ({ inputType, eventEmitter, setEventEmitter }) => {
    const [listOptions, setListOptions] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, inputType)));
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setListOptions(docs);
                console.log(docs);
            } catch {

            } finally {
                setLoading(false)
                await setEventEmitter(eventEmitter + 1)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <option value="">LOADING...</option>
    }

    return (
        <>
            <div>
                <label htmlFor="itemPress">Press</label>
                <select
                    name="itemPress"
                    id="itemPress"
                    value={data.itemPress}
                    onChange={handleChange}
                >
                    <PopulatedDropdown inputType={"presses"} />
                </select>
            </div>
            <div>
                <label htmlFor="itemPrintMode">Print Mode</label>
                <select
                    name="itemPrintMode"
                    id="itemPrintMode"
                    value={data.itemPrintMode}
                    onChange={handleChange}
                >
                    <PopulatedDropdown inputType={"print_modes"} />
                </select>
            </div>
            <div>
                <label htmlFor="itemPrintQuality">Print Quality</label>
                <select
                    name="itemPrintQuality"
                    id="itemPrintQuality"
                    value={data.itemPrintQuality}
                    onChange={handleChange}
                >
                    <option>-</option>
                    <option value="production-gloss">Production Gloss</option>
                </select>
            </div>

            <option></option>
            {listOptions.map((listOption, index) => (
                <option key={index} value={listOption.id}>{listOption.name}</option>
            ))}
        </>
    )
}

export default PopulatedPressDropdown