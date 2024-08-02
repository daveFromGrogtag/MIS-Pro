import { useState } from "react"

function OrderInfo() {
    const [data, setData] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        let payload = {
            ...data,
            [name]: value
        }
        console.log(payload)
        setData(payload)
    }

    return (
        <>
            <section id="order-info-section">
                <div>
                    <label htmlFor="reference-1">Reference 1</label>
                    <input type="text" name="reference-1"/>
                </div>
                <div>
                    <label htmlFor="reference-2">Reference 2</label>
                    <input type="text" name="reference-2"/>
                </div>
                <div>
                    <label htmlFor="client">Client</label>
                    <input list="client-list" type="text" name="reference-2"/>
                        <button>Add New Client</button>
                        <datalist id="client-list">
                            <option value="Chocolate"></option>
                            <option value="Coconut"></option>
                            <option value="Mint"></option>
                            <option value="Strawberry"></option>
                            <option value="Vanilla"></option>
                        </datalist>
                </div>
                <div>
                    <div>
                        <label htmlFor="attn">Attention</label>
                        <input type="text" id="attn" name="attn" placeholder="Attention.." required/>
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" name="address" placeholder="Address.." required/>
                    </div>
                    <div>
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" name="city" placeholder="City.." required/>
                    </div>
                    <div>
                        <label htmlFor="state">State</label>
                        <input type="text" id="state" name="state" placeholder="State.." required/>
                    </div>
                    <div>
                        <label htmlFor="zip">Zip Code</label>
                        <input type="text" id="zip" name="zip" placeholder="Zip code.." required/>
                    </div>
                    <div>
                        <label htmlFor="country">Country</label>
                        <select id="country" name="country" required>
                            <option value="">Select country..</option>
                            <option value="USA">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="due-date">Due Date</label>
                    <input type="date" name="due-date" id="due-date"/>
                </div>
                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea name="notes" id="notes"></textarea>
                </div>
                <div>
                    <label htmlFor="order-markup">Markup (%)</label>
                    <input type="number" name="order-markup" id="order-markup" value="0" min="0"/>
                </div>
                <div>
                    <label htmlFor="order-discount">Discount (% after markup)</label>
                    <input type="number" name="order-discount" id="order-discount" value="0" min="0" max="100"/>
                </div>
            </section>
        </>
    )
}

export default OrderInfo