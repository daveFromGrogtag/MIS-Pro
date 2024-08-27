import { useState } from "react"

function OrderInfo({data, setData}) {
    // const [data, setData] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        let payload = {
            ...data,
            [name]: value
        }
        setData(payload)
    }

    const handleClientChange = (e) => {
        let clientName = e.target.value
        let payload;
        if (clientName = 'techstyles') {
            payload = {
                ...data,
                'client': clientName,
                'billingAddress1': '30803 San Clemente St',
                'billingAddress2': '',
                'billingAddress3': '',
                'billingAttn': 'Mr. Techstyles',
                'billingCity': 'Hayward',
                'billingCompany': 'TechStyles',
                'billingCountry': 'USA',
                'billingState': 'CA',
                'billingZip': '94544'
            }
        }
        else {
            payload = {
                ...data,
                'client': clientName
            }
        }
        setData(payload)
    }

    return (
        <>
            <section id="order-info-section">
                <div>
                    <label htmlFor="client">Client</label>
                    <input list="client-list" type="text" name="client" value={data.client} onChange={handleClientChange}/>
                        <button>Add New Client</button>
                        <datalist id="client-list">
                            <option value="techstyles">TechStyles</option>
                        </datalist>
                </div>
                <div>
                    <label htmlFor="ref1">Client Reference 1</label>
                    <input type="text" name="ref1" value={data.ref1} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="ref2">Client Reference 2</label>
                    <input type="text" name="ref2" value={data.ref2} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="desc">Description</label>
                    <input type="text" name="desc" value={data.desc} onChange={handleChange}/>
                </div>
                <hr />
                <details>
                    <summary>Billing Info</summary>
                    <br />
                    <div>
                        <label htmlFor="billingCompany">Billing Company</label>
                        <input type="text" id="billingCompany" name="billingCompany" placeholder="Billing Company" required value={data.billingCompany} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingAttn">Billing Attention</label>
                        <input type="text" id="billingAttn" name="billingAttn" placeholder="Billing Attention.." required value={data.billingAttn} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingAddress1">Billing Address</label>
                        <input type="text" id="billingAddress1" name="billingAddress1" placeholder="Billing Address.." required value={data.billingAddress1} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingAddress2">Billing Address 2</label>
                        <input type="text" id="billingAddress2" name="billingAddress2" placeholder="Address Line 2.." required value={data.billingAddress2} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingAddress3">Billing Address 3</label>
                        <input type="text" id="billingAddress3" name="billingAddress3" placeholder="Address Line 3.." required value={data.billingAddress3} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingCity">Billing City</label>
                        <input type="text" id="billingCity" name="billingCity" placeholder="Billing City.." required value={data.billingCity} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingState">Billing State</label>
                        <input type="text" id="billingState" name="billingState" placeholder="Billing State.." required value={data.billingState} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingZip">Billing Zip Code</label>
                        <input type="text" id="billingZip" name="billingZip" placeholder="Billing Zip code.." required value={data.billingZip} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="billingCountry">Country</label>
                        <select id="billingCountry" name="billingCountry" required value={data.billingCountry} onChange={handleChange}>
                            <option value="">Select country..</option>
                            <option value="USA">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                        </select>
                    </div>
                </details>
                <hr />
                <details>
                    <summary>Shipping Info</summary>
                    <br />
                    <div>
                        <label htmlFor="shippingCompany">Shipping Company</label>
                        <input type="text" id="shippingCompany" name="shippingCompany" placeholder="Shipping Company" required value={data.shippingCompany} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingAttn">Shipping Attention</label>
                        <input type="text" id="shippingAttn" name="shippingAttn" placeholder="Shipping Attention.." required value={data.shippingAttn} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingAddress1">Shipping Address</label>
                        <input type="text" id="shippingAddress1" name="shippingAddress1" placeholder="Shipping Address.." required value={data.shippingAddress1} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingAddress2">Shipping Address 2</label>
                        <input type="text" id="shippingAddress2" name="shippingAddress2" placeholder="Address Line 2.." required value={data.shippingAddress2} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingAddress3">Shipping Address 3</label>
                        <input type="text" id="shippingAddress3" name="shippingAddress3" placeholder="Address Line 3.." required value={data.shippingAddress3} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingCity">Shipping City</label>
                        <input type="text" id="shippingCity" name="shippingCity" placeholder="Shipping City.." required value={data.shippingCity} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingState">State</label>
                        <input type="text" id="shippingState" name="shippingState" placeholder="Shipping State.." required value={data.shippingState} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingZip">Zip Code</label>
                        <input type="text" id="shippingZip" name="shippingZip" placeholder="Shipping Zip code.." required value={data.shippingZip} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="shippingCountry">Country</label>
                        <select id="shippingCountry" name="shippingCountry" required value={data.shippingCountry} onChange={handleChange}>
                            <option value="">Select country..</option>
                            <option value="USA">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                        </select>
                    </div>
                </details>
                <hr />
                <div>
                    <label htmlFor="dueDate">Due Date</label>
                    <input type="date" name="dueDate" id="dueDate" value={data.dueDate} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea name="notes" id="notes" value={data.notes} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label htmlFor="orderMarkup">Markup (%)</label>
                    <input type="number" name="orderMarkup" id="orderMarkup" defaultValue="0" min="0" value={data.orderMarkup} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="orderDiscount">Discount (% after markup)</label>
                    <input type="number" name="orderDiscount" id="orderDiscount" defaultValue="0" min="0" max="100" value={data.orderDiscount} onChange={handleChange}/>
                </div>
            </section>
        </>
    )
}

export default OrderInfo