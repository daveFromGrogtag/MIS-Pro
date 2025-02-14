import { useState, useEffect } from 'react'
import {db} from '../scripts/firebase/init.ts'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Loading from './Loading.tsx'
import PopulatedDropdown from './PopulatedDropdown.tsx'
import UploadPdf from './UploadPdf.tsx'

const EditItem = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState('')
    const [eventEmitter, setEventEmitter] = useState(0)
    const [orderData, setOrderData] = useState({})
    const [items, setItems] = useState([])
    const [itemData, setItemData] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const itemIndex = parseInt(urlParams.get('item')) - 1

    const exportToFirebase = () => {
        try {
            updateDoc(doc(db, "orders", urlParams.get('order')), {
                items
            }).then(() => {
                alert('item saved')
            })
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        let payload = {
            ...itemData,
            [name]: value
        }
        setItemData(payload)
        setItems(items[itemIndex] = payload)
        console.log(items);  
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "orders", urlParams.get('order'))
                const docSnap = await getDoc(docRef)
                setOrder(urlParams.get('order'))
                setOrderData(docSnap.data().data)
                setItems(docSnap.data().items)
                setItemData(docSnap.data().items[itemIndex])
            } catch (error) {
                console.error(error);
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])


    if (loading) {
        return <Loading/>
    }

    if (notFound) {
        return (<>
            <h1 className="branded-title">Item not found</h1>
            <h3 className="branded-title">Are you sure this is the right order/item number?</h3>
            <a href="/orders">Back to orders</a>
        </>
        )
    }

    return (
        <div>
            <h1>Item: {order}-{itemIndex+1}</h1>
            <p>{JSON.stringify(itemData)}</p>

            <h2>Add New Item</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div>
                                    <label htmlFor="item-product">Product</label>
                                    <input
                                        type="text"
                                        name="itemProduct"
                                        id="itemProduct"
                                        value={itemData.itemProduct}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemPress">Press</label>
                                    <select
                                        name="itemPress"
                                        id="itemPress"
                                        value={itemData.itemPress}
                                        onChange={handleChange}
                                    >
                                    <PopulatedDropdown inputType={"presses"} eventEmitter={eventEmitter} setEventEmitter={setEventEmitter}/>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="itemPrintMode">Print Mode</label>
                                    <select
                                        name="itemPrintMode"
                                        id="itemPrintMode"
                                        value={itemData.itemPrintMode}
                                        onChange={handleChange}
                                    >
                                    <PopulatedDropdown inputType={"print_modes"} eventEmitter={eventEmitter} setEventEmitter={setEventEmitter}/>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="itemPrintQuality">Print Quality</label>
                                    <select
                                        name="itemPrintQuality"
                                        id="itemPrintQuality"
                                        value={itemData.itemPrintQuality}
                                        onChange={handleChange}
                                    >
                                        <option>-</option>
                                        <option value="production-gloss">Production Gloss</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="itemCutter">Cutter</label>
                                    <select
                                        name="itemCutter"
                                        id="itemCutter"
                                        value={itemData.itemCutter}
                                        onChange={handleChange}
                                    >
                                    <PopulatedDropdown inputType={"cutters"} eventEmitter={eventEmitter} setEventEmitter={setEventEmitter}/>
                                    </select>
                                </div>
                                <hr />
                                <div>
                                    <label htmlFor="itemSubstrate">Substrate</label>
                                    <select
                                        name="itemSubstrate"
                                        id="itemSubstrate"
                                        value={itemData.itemSubstrate}
                                        onChange={handleChange}
                                    >
                                    <PopulatedDropdown inputType={"substrates"} eventEmitter={eventEmitter} setEventEmitter={setEventEmitter}/>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="itemLaminate">Laminate</label>
                                    <select
                                        name="itemLaminate"
                                        id="itemLaminate"
                                        value={itemData.itemLaminate}
                                        onChange={handleChange}
                                    >
                                        <PopulatedDropdown inputType={"laminates"} eventEmitter={eventEmitter} setEventEmitter={setEventEmitter}/>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="itemWidth">Width</label>
                                    <input
                                        type="number"
                                        name="itemWidth"
                                        id="itemWidth"
                                        min="0"
                                        value={itemData.itemWidth}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemHeight">Height</label>
                                    <input
                                        type="number"
                                        name="itemHeight"
                                        id="itemHeight"
                                        min="0"
                                        value={itemData.itemHeight}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemBleed">Bleed</label>
                                    <input
                                        type="number"
                                        name="itemBleed"
                                        id="itemBleed"
                                        min="0"
                                        value={itemData.itemBleed}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemQuantity">Quantity</label>
                                    <input
                                        type="number"
                                        name="itemQuantity"
                                        id="itemQuantity"
                                        min="1"
                                        value={itemData.itemQuantity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemThumbnail">Item Thumbnail</label>
                                    {/* <UploadPdf onThumbnailUrlChange={handleThumbnailUpload}/> */}
                                    <img src={itemData.itemThumbnail} alt="Thumbnail Image" />
                                </div>
                                <div>
                                    <label htmlFor="itemCost">Est. Cost</label>
                                    <input
                                        type="number"
                                        name="itemCost"
                                        id="itemCost"
                                        min="0"
                                        value={itemData.itemCost}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

        <button onClick={exportToFirebase}>Save Changes</button>
        </div>
    )
}

export default EditItem