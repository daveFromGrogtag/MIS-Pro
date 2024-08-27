import { useState, useEffect } from 'react'
import PreviewCanvas from './PreviewCanvas.tsx'
import estimator from '../scripts/estimator.js'
import generateUUID from '../scripts/generateUUID.js'
import { uploadFile } from '../scripts/firebase/uploadFiles.ts'
// import { uploadFile } from "./firebase/upload-file.js";

function ItemList({items, setItems}) {

    // const [items, setItems] = useState([])
    const [data, setData] = useState({})
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        let currentItemCost;
        if (data.itemWidth && data.itemHeight && data.itemBleed && data.itemQuantity && data.itemSubstrate && data.itemLaminate && data.itemPress && data.itemPrintMode && data.itemPrintQuality) {
            currentItemCost = estimator(data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality).totalCost.toFixed(2)
        } else {
            currentItemCost = 0
        }
        let payload = {
            ...data,
            itemCost: currentItemCost
        } 
        setData(payload)
    }, [data.itemWidth, data.itemHeight, data.itemBleed, data.itemQuantity, data.itemSubstrate, data.itemLaminate, data.itemPress, data.itemPrintMode, data.itemPrintQuality])
    
    
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
                itemSubstrate: data.itemSubstrate,
                itemLaminate: data.itemLaminate,
                itemWidth: data.itemWidth,
                itemHeight: data.itemHeight,
                itemBleed: data.itemBleed,
                itemQuantity: data.itemQuantity,
                itemCost: data.itemCost,
                itemThumbnail: data.itemThumbnail
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

    const handleThumbnailUpload = (e) => {
        const thumbnailFile = e.target.files[0]
        const reader = new FileReader()
        if (thumbnailFile && thumbnailFile.type.startsWith('image/')) {
            console.log("Image");
            reader.onload = (e) => {

            }
        } else if (thumbnailFile && thumbnailFile.type === 'application/pdf') {
            console.log("PDF");
             reader.onload = async (e) => {
                const pdfData = new Uint8Array(e.target.result);
                console.log(e);
                try {
                    const thumbnailUrl = await uploadFile(pdfData)
                    setData({...data, itemThumbnail: thumbnailUrl})
                } catch (error) {
                    console.error(error)
                }
             }
        }
        
    }

    return (
        <>
            <h2>Item List</h2>
            {isVisible && (
            <section className="add-item-section">
            <section className="add-item-modal">
                <h2>Add New Item</h2>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
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
                                <option>-</option>
                                <option value="canon-colorado">CANON Colorado</option>
                                <option value="canon-arizona">CANON Arizona</option>
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
                                <option>-</option>
                                <option value="cmyk-1-side">CMYK - 1 Side</option>
                                <option value="cmyk-2-side">CMYK - 2 Side</option>
                                <option value="cmyk-white">CMYK + White Spot</option>
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
                            <label htmlFor="itemSubstrate">Substrate</label>
                            <select 
                                name="itemSubstrate" 
                                id="itemSubstrate"
                                value={data.itemSubstrate}
                                onChange={handleChange}
                            >
                                <option>-</option>
                                <option value="vinyl">Standard Self Adhesive Vinyl</option>
                                <option value="holo-vinyl">Holographic Self Adhesive Vinyl</option>
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
                                <option>-</option>
                                <option value="none">None</option>
                                <option value="soft-touch">Soft Touch</option>
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
                            <input type="file" name="itemThumbnail" onChange={handleThumbnailUpload} />
                            <img src={data.itemThumbnail} alt="" />
                        </div>
                        <div>
                            <label htmlFor="itemCost">Est. Cost</label>
                            <p>{data.itemCost}</p>
                        </div>
                    </div>
                    <div style={{background: 'lightgrey', padding: '.25rem', maxHeight: '415px'}}>
                        <PreviewCanvas width={data.itemWidth} height={data.itemHeight} bleed={data.itemBleed}/>
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
                    <th>Product</th>
                    <th>Substrate</th>
                    <th>Laminate</th>
                    <th>Dimensions</th>
                    <th>Press</th>
                    <th>Mode</th>
                    <th>Quality</th>
                    <th>Quantity</th>
                    <th>Est. Cost</th>
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
                        <td>{item.itemQuantity}</td>
                        <td>{estimator(item.itemWidth, item.itemHeight, item.itemBleed, item.itemQuantity, item.itemSubstrate, item.itemLaminate, item.itemPress, item.itemPrintMode, item.itemPrintQuality).totalCost.toFixed(2)}</td>
                        <td><button onClick={() => removeItem(item.id)}>Remove</button></td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={11}>
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