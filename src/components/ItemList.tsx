import { useState } from 'react'
import estimator from '../scripts/estimator.js'
import generateUUID from '../scripts/generateUUID.js'


function ItemList() {
    const [items, setItems] = useState([])
    const [data, setData] = useState({})
    const [isVisible, setIsVisible] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        let payload = {
            ...data,
            [name]: value
        }
        console.log(payload)
        setData(payload)
    }

    const addItem = (e) => {
        let payload = [
            ...items,
            {
                id: generateUUID(),
                itemProduct: data.itemProduct,
                itemPress: data.itemPress,
                itemSubstrate: data.itemSubstrate,
                itemLaminate: data.itemLaminate,
                itemWidth: data.itemWidth,
                itemHeight: data.itemHeight,
                itemBleed: data.itemBleed,
                itemQuantity: data.itemQuantity
            }
        ]
        setItems(payload)
        toggleVisibility()
    }

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const exportState = (e) => {
        console.log(items)
    }

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState)
    }

    const refreshList = () => {
        setItems([...items])
    }

    return (
        <>
            <h2>Item List</h2>
            {isVisible && (
            <section className="add-item-section">
            <section className="add-item-modal">
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
                        <option value="canon-colorado-production">CANON Colorado Production</option>
                        <option value="canon-arizona-production">CANON Arizona Production</option>
                        <option value="canon-colorado-quality">CANON Colorado Quality</option>
                        <option value="canon-arizona-quality">CANON Arizona Quality</option>
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
                {/* <button id="add-item">Add Item</button> */}
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
                        <td>{item.itemQuantity}</td>
                        <td>{estimator(item.itemWidth, item.itemHeight, item.itemBleed, item.itemQuantity, item.itemSubstrate, item.itemLaminate, item.itemPress, 0, 0).totalCost.toFixed(2)}</td>
                        <td><button onClick={() => removeItem(item.id)}>Remove</button></td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={9}>
                        <button onClick={exportState}>Export</button>
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