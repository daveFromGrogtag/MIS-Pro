import { useState, useEffect } from 'react'
import PreviewCanvas from './PreviewCanvas.tsx'
import estimator from '../scripts/estimator.js'
import generateUUID from '../scripts/generateUUID.js'
import PopulatedDropdown from './PopulatedDropdown.tsx'
import UploadPdf from './UploadPdf.tsx'
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs } from 'firebase/firestore'

// import { uploadFile } from '../scripts/firebase/uploadFiles.ts'
// import { uploadFile } from "./firebase/upload-file.js";

function ItemList({ items, setItems, orderId }) {

    // const [items, setItems] = useState([])
    const [data, setData] = useState({
        itemThumbnail: '/images/no-image.jpg',
        itemProduct: "",
        itemPress: "",
        itemPrintMode: "",
        itemPrintQuality: "",
        itemCutter: "",
        itemSubstrate: "",
        itemLaminate: "",
        itemWidth: 0,
        itemHeight: 0,
        itemBleed: 0,
        itemQuantity: 1,
        itemCost: 0
    })
    const [isVisible, setIsVisible] = useState(false)
    const [pressVal, setPressVal] = useState([])

    useEffect(() => {
        async function grabDbValues(collectionName:string) {
            const querySnapshot = await getDocs(query(collection(db, collectionName)));
                    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setPressVal(docs)
        }
        grabDbValues('presses')
        
        console.log(pressVal);
    }, [])

    useEffect(() => {
        let currentItemCost;
        if (data.itemWidth && data.itemHeight && data.itemBleed && data.itemQuantity && data.itemSubstrate && data.itemLaminate && data.itemPress && data.itemPrintMode && data.itemPrintQuality && data.itemCutter) {
            currentItemCost = estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter).totalCost.toFixed(2)
            console.log(estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter));

        } else {
            currentItemCost = 0
        }
        let payload = {
            ...data,
            itemCost: currentItemCost
        }
        setData(payload)
    }, [data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter])


    const handleChange = (e) => {
        // let currentItemCost;
        // if (data.itemWidth && data.itemHeight && data.itemBleed && data.itemQuantity && data.itemSubstrate && data.itemLaminate && data.itemPress) {
        //     currentItemCost = estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, 0, 0).totalCost.toFixed(2)
        // } else {
        //     currentItemCost = 0
        // }

        const { name, value } = e.target
        let payload = {
            ...data,
            [name]: value,
            // itemCost: currentItemCost
        }
        setData(payload)
    }

    const addItem = (e) => {
        let payload = [
            ...items,
            {
                id: generateUUID(),
                itemProduct: data.itemProduct,
                itemPress: data.itemPress,
                itemPrintMode: data.itemPrintMode,
                itemPrintQuality: data.itemPrintQuality,
                itemCutter: data.itemCutter,
                itemSubstrate: data.itemSubstrate,
                itemLaminate: data.itemLaminate,
                itemWidth: data.itemWidth,
                itemHeight: data.itemHeight,
                itemBleed: data.itemBleed,
                itemQuantity: data.itemQuantity,
                itemThumbnail: data.itemThumbnail,
                itemCost: data.itemCost
            }
        ]
        setItems(payload)
        toggleVisibility()
    }

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState)
    }

    const refreshList = () => {
        setItems([...items])
    }

    const handleThumbnailUpload = (url) => {
        setData({
            ...data,
            itemThumbnail: url
        })
    }



    return (
        <>
            <h2>Item List</h2>
            {isVisible && (
                <section className="add-item-section">
                    <section className="add-item-modal">
                        <h2>Add New Item</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div>
                                    <label htmlFor="item-product">Product</label>
                                    <input
                                        type="text"
                                        name="itemProduct"
                                        id="itemProduct"
                                        value={data.itemProduct}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemPress">Press</label>
                                    <select
                                        name="itemPress"
                                        id="itemPress"
                                        value={data.itemPress}
                                        onChange={handleChange}
                                    >
                                    <PopulatedDropdown inputType={"presses"}/>
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
                                    <PopulatedDropdown inputType={"print_modes"}/>
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
                                <div>
                                    <label htmlFor="itemCutter">Cutter</label>
                                    <select
                                        name="itemCutter"
                                        id="itemCutter"
                                        value={data.itemCutter}
                                        onChange={handleChange}
                                    >
                                    <PopulatedDropdown inputType={"cutters"}/>
                                    </select>
                                </div>
                                <hr />
                                <div>
                                    <label htmlFor="itemSubstrate">Substrate</label>
                                    <select
                                        name="itemSubstrate"
                                        id="itemSubstrate"
                                        value={data.itemSubstrate}
                                        onChange={handleChange}
                                    >
                                    <PopulatedDropdown inputType={"substrates"}/>
                                        {/* <option>-</option>
                                        <option value="vinyl">Standard Self Adhesive Vinyl</option>
                                        <option value="holo-vinyl">Holographic Self Adhesive Vinyl</option>
                                        <option value="foam-core">Foam Core</option>
                                        <option value="ceramic-tile">Ceramic Tile</option> */}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="itemLaminate">Laminate</label>
                                    <select
                                        name="itemLaminate"
                                        id="itemLaminate"
                                        value={data.itemLaminate}
                                        onChange={handleChange}
                                    >
                                        <PopulatedDropdown inputType={"laminates"}/>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="itemWidth">Width</label>
                                    <input
                                        type="number"
                                        name="itemWidth"
                                        id="itemWidth"
                                        min="0"
                                        value={data.itemWidth}
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
                                        value={data.itemHeight}
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
                                        value={data.itemBleed}
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
                                        value={data.itemQuantity}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemThumbnail">Item Thumbnail</label>
                                    {/* <UploadThumbnail onThumbnailUrlChange={handleThumbnailUpload} /> */}
                                    <UploadPdf onThumbnailUrlChange={handleThumbnailUpload}/>
                                    {/* <UploadContainer/> */}
                                    {/* <button onClick={handleThumbnailUpload}>Thumbnail</button> */}
                                    <img src={data.itemThumbnail} alt="Thumbnail Image" />
                                </div>
                                <div>
                                    <label htmlFor="itemCost">Est. Cost</label>
                                    <input
                                        type="number"
                                        name="itemCost"
                                        id="itemCost"
                                        min="0"
                                        value={data.itemCost}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div style={{ background: 'lightgrey', padding: '.25rem', maxHeight: '415px' }}>
                                <PreviewCanvas width={data.itemWidth} height={data.itemHeight} bleed={data.itemBleed} />
                            </div>
                        </div>
                        <button onClick={toggleVisibility}>Cancel</button>
                        <button onClick={addItem}>Add</button>
                    </section>
                </section>
            )}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Prod</th>
                        <th>Sub</th>
                        <th>Lam</th>
                        <th>Dims</th>
                        <th>Press</th>
                        <th>Mode</th>
                        <th>Quality</th>
                        <th>Cutter</th>
                        <th>Quantity</th>
                        <th>Est. Cost</th>
                        <th>Thumb</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="item-section">
                    {items.map((item, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.itemProduct}</td>
                            <td>{item.itemSubstrate}</td>
                            <td>{item.itemLaminate}</td>
                            <td>{item.itemWidth} x {item.itemHeight}</td>
                            <td>{item.itemPress}</td>
                            <td>{item.itemPrintMode}</td>
                            <td>{item.itemPrintQuality}</td>
                            <td>{item.itemCutter}</td>
                            <td>{item.itemQuantity}</td>
                            {/* <td>{estimator(item.itemWidth, item.itemHeight, item.itemBleed, item.itemQuantity, item.itemSubstrate, item.itemLaminate, item.itemPress, item.itemPrintMode, item.itemPrintQuality).totalCost.toFixed(2)}</td> */}
                            <td>$ {item.itemCost}</td>
                            <td><img src={item.itemThumbnail} alt="no-image" /></td>
                            <td>
                                <button onClick={() => removeItem(item.id)}>Remove</button>
                                {orderId && <button><a href={`/edit-item?order=${orderId}&item=${index + 1}`}>Edit</a></button>}
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={13}>
                            <button onClick={refreshList}>Refresh</button>
                            <button onClick={toggleVisibility}>Add Item +</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}

export default ItemList