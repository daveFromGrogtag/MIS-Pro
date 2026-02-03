import { useState, useEffect } from 'react'
import PreviewCanvas from './PreviewCanvas.tsx'
import estimator from '../scripts/estimator.js'
import generateUUID from '../scripts/generateUUID.js'
import PopulatedDropdown from './PopulatedDropdown.tsx'
// import PopulatedPressDropdown from './PopulatedPressDropdown.tsx'
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
        itemCost: 0,
        itemNotes: "",
        itemHiddenNotes: "",
        itemProof: "PDF Proof",
        itemFinishing: "",
        itemTaxable: true

    })
    const [isVisible, setIsVisible] = useState(false)
    const [acceptedQty, setAcceptedQty] = useState(false)
    // const [itemPress, setItemPress] = useState("")
    // const [itemPrintMode, setItemPrintMode] = useState("")
    // const [itemPrintQuality, setItemPrintQuality] = useState("")

    // useEffect(() => {
    //     let payload = {
    //         ...data,
    //         itemPress,
    //         itemPrintMode,
    //         itemPrintQuality
    //     }
    // }, [itemPress, itemPrintMode, itemPrintQuality])

    // useEffect(() => {
    //     async function loadEstimate() {
    //         try {
    //             let currentItemCost;
    //             if (data.itemWidth && data.itemHeight && data.itemBleed && data.itemQuantity && data.itemSubstrate && data.itemLaminate && data.itemPress && data.itemPrintMode && data.itemPrintQuality && data.itemCutter) {
    //                 currentItemCost = estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter).totalCost.toFixed(2)
    //                 console.log(estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter));
    //             } else {
    //                 currentItemCost = 0
    //             }
    //             let payload = {
    //                 ...data,
    //                 itemCost: currentItemCost
    //             }
    //             setData(payload)
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     loadEstimate()
    // }, [data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter])


    useEffect(() => {
        if (containsQty(data) && !acceptedQty) {
            if (confirm("I notice that you've added qty to the notes section. I hope you added that info to the quantity break down of each item.")) {
                setAcceptedQty(true)
            }
        } else { }
    }, [data])

    function containsQty(obj) {
        const regex = /\b(quantity|qty)\b/i; // whole word, case-insensitive

        for (const key in obj) {
            if (Object.hasOwn(obj, key)) {
                const value = obj[key];

                if (typeof value === "string" && regex.test(value)) {
                    return true; // found a match
                }
            }
        }

        return false; // no matches
    }

    const getEstimate = async () => {
        try {
            let currentItemCost;
            if (data.itemWidth && data.itemHeight && data.itemBleed && data.itemQuantity && data.itemSubstrate && data.itemLaminate && data.itemPress && data.itemPrintMode && data.itemPrintQuality && data.itemCutter) {
                // currentItemCost = await estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter).totalCost.toFixed(2)
                let currentItemCostObject = await estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality, data.itemCutter)
                currentItemCost = currentItemCostObject["totalCost"].toFixed(2)
                console.log(currentItemCost);

            } else {
                currentItemCost = 0
            }
            let payload = {
                ...data,
                itemCost: currentItemCost
            }
            setData(payload)
        } catch (error) {
            console.error(error);
        }
        // console.log("TESTING ESTIMATES");
        // console.log(data);

    }

    const handleChange = (e) => {
        // let currentItemCost;
        // if (data.itemWidth && data.itemHeight && data.itemBleed && data.itemQuantity && data.itemSubstrate && data.itemLaminate && data.itemPress) {
        //     currentItemCost = estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, 0, 0).totalCost.toFixed(2)
        //     // currentItemCost = 2.5
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

    const handleCheckbox = (e) => {
        const checkBoxName = e.target.name
        let currentValue = data[checkBoxName]
        let newValue = !currentValue
        let payload = {
            ...data,
            [checkBoxName]: newValue
        }
        setData(payload)
        console.log(payload); 
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
                itemCost: data.itemCost,
                itemNotes: data.itemNotes,
                itemHiddenNotes: data.itemHiddenNotes,
                itemProof: data.itemProof,
                itemFinishing: data.itemFinishing,
                itemTaxable: data.itemTaxable
            }
        ]
        setItems(payload)
        toggleVisibility()
    }

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const duplicateItem = (index) => {
        let originalItem = items[index]
        let payload = [
            ...items,
            {
                id: generateUUID(),
                itemProduct: originalItem.itemProduct,
                itemPress: originalItem.itemPress,
                itemPrintMode: originalItem.itemPrintMode,
                itemPrintQuality: originalItem.itemPrintQuality,
                itemCutter: originalItem.itemCutter,
                itemSubstrate: originalItem.itemSubstrate,
                itemLaminate: originalItem.itemLaminate,
                itemWidth: originalItem.itemWidth,
                itemHeight: originalItem.itemHeight,
                itemBleed: originalItem.itemBleed,
                itemQuantity: originalItem.itemQuantity,
                itemThumbnail: originalItem.itemThumbnail,
                itemCost: originalItem.itemCost,
                itemNotes: originalItem.itemNotes,
                itemHiddenNotes: originalItem.itemHiddenNotes,
                itemProof: originalItem.itemProof,
                itemFinishing: originalItem.itemFinishing,
                itemTaxable: originalItem.itemTaxable
            }
        ]
        setItems(payload)
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
                        {/* <button onClick={showMe}>Add Std Poster</button> */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                {/* <PopulatedPressDropdown
                                itemPress={itemPress}
                                setItemPress={setItemPress}
                                itemPrintMode={itemPrintMode}
                                setItemPrintMode={setItemPrintMode}
                                itemPrintQuality={itemPrintQuality}
                                setItemPrintQuality={setItemPrintQuality}
                            /> */}
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
                                        <option value="production-matte">Production Matte</option>
                                        <option value="high-quality-gloss">High Quality Gloss</option>
                                        <option value="high-quality-matte">High Quality Gloss</option>
                                        <option value="spot-gloss-matte">High Quality Gloss</option>
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
                                        <PopulatedDropdown inputType={"cutters"} />
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
                                        <PopulatedDropdown inputType={"substrates"} />
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
                                        <PopulatedDropdown inputType={"laminates"} />
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
                                    <label htmlFor="itemNotes">Notes</label>
                                    <textarea
                                        name="itemNotes"
                                        id="itemNotes"
                                        value={data.itemNotes}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemHiddenNotes">Hidden Notes</label>
                                    <textarea
                                        name="itemHiddenNotes"
                                        id="itemHiddenNotes"
                                        value={data.itemHiddenNotes}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemProof">Proof</label>
                                    <select
                                        name="itemProof"
                                        id="itemProof"
                                        value={data.itemProof}
                                        onChange={handleChange}
                                    >
                                        <option>PDF Proof</option>
                                        <option>Physical Proof</option>
                                    </select>
                                </div>
                                {/* <div className="checkboxes">
                                    <div className="checkbox-container">
                                        <label htmlFor="finishing-1">Finishing 1</label>
                                        <input type="checkbox" name="finishing-1" id="finishing-1" />
                                        <label htmlFor="finishing-2">Finishing 2</label>
                                        <input type="checkbox" name="finishing-2" id="finishing-2" />
                                        <label htmlFor="finishing-1">Finishing 1</label>
                                        <input type="checkbox" name="finishing-1" id="finishing-1" />
                                        <label htmlFor="finishing-2">Finishing 2</label>
                                        <input type="checkbox" name="finishing-2" id="finishing-2" />
                                    </div>
                                    <div className="checkbox-container">
                                        <label htmlFor="finishing-1">Finishing 1</label>
                                        <input type="checkbox" name="finishing-1" id="finishing-1" />
                                        <label htmlFor="finishing-2">Finishing 2</label>
                                        <input type="checkbox" name="finishing-2" id="finishing-2" />
                                        <label htmlFor="finishing-1">Finishing 1</label>
                                        <input type="checkbox" name="finishing-1" id="finishing-1" />
                                        <label htmlFor="finishing-2">Finishing 2</label>
                                        <input type="checkbox" name="finishing-2" id="finishing-2" />
                                    </div>
                                </div> */}
                                <div>
                                    <label htmlFor="itemFinishing">Finishing</label>
                                    <textarea
                                        name="itemFinishing"
                                        id="itemFinishing"
                                        value={data.itemFinishing}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="itemThumbnail">Item Thumbnail</label>
                                    {/* <UploadThumbnail onThumbnailUrlChange={handleThumbnailUpload} /> */}
                                    <UploadPdf onThumbnailUrlChange={handleThumbnailUpload} />
                                    {/* <UploadContainer/> */}
                                    {/* <button onClick={handleThumbnailUpload}>Thumbnail</button> */}
                                    <img src={data.itemThumbnail} alt="Thumbnail Image" />
                                </div>
                                <div>
                                    <label htmlFor="itemTaxable">Taxable?</label>
                                    <input type="checkbox" name="itemTaxable" id="itemTaxable" checked={data.itemTaxable} onClick={handleCheckbox}/>
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
                        <button onClick={getEstimate}>Estimate</button>
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
                            <td>$ {item.itemCost}</td>
                            <td><img src={item.itemThumbnail} alt="no-image" /></td>
                            <td>
                                <button title="Remove Item" onClick={() => removeItem(item.id)}><i className="fa-solid fa-trash"></i></button>
                                {orderId && <button><a title="Edit Item" href={`/edit-item?order=${orderId}&item=${index + 1}`}><i className="fa-solid fa-pen-to-square"></i></a></button>}
                                {orderId && <button><a title="Item Ticket" href={`/ticket-item?order=${orderId}&item=${index + 1}`}><i className="fa-solid fa-ticket"></i></a></button>}
                                <button title="Duplicate Item" onClick={() => duplicateItem(index)}><i className="fa-solid fa-copy"></i></button>
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