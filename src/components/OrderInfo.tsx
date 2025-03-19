import { useState, useEffect } from "react"
import PopulatedCustomerDropdown from './PopulatedCustomerDropdown.tsx'
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs } from 'firebase/firestore'


function OrderInfo({data, setData}) {
    // const [data, setData] = useState({})
    const [customerList, setCustomerList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, 'customers')));
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomerList(docs);
                console.log(docs);
            } catch  {
            }
        }
        fetchData()
    }, [])

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
        let foundCustomer = customerList.find(obj => obj["name"] === clientName) || {}
        let payload;
        if (foundCustomer) {
            payload = {
                ...data,
                'client': clientName,
                ...foundCustomer.data
            }
        }
        else {
            payload = {
                ...data,
                'client': clientName
            }
        }
        console.log(foundCustomer);
        setData(payload)
    }

    return (
        <>
            <section id="order-info-section">
                <div>
                    <label htmlFor="client">Client</label>
                    <input list="client-list" type="text" name="client" value={data.client} onChange={handleClientChange}/>
                        {/* <button>Add New Client</button> */}
                        <datalist id="client-list">
                        <PopulatedCustomerDropdown inputType={"customers"}/>
                            {/* <option value="techstyles">TechStyles</option> */}
                        </datalist>
                </div>
                <div className="form-line">
                    <div>
                        <label htmlFor="ref1">Client Reference 1</label>
                        <input type="text" name="ref1" value={data.ref1} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="ref2">Client Reference 2</label>
                        <input type="text" name="ref2" value={data.ref2} onChange={handleChange}/>
                    </div>
                </div>
                <div className="form-line">
                <div>
                    <label htmlFor="desc">Description</label>
                    <input type="text" name="desc" value={data.desc} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="qbRef">QuickBooks Ref</label>
                    <input type="text" name="qbRef" value={data.qbRef} onChange={handleChange}/>
                </div>
                </div>
                <hr />
                <details>
                    <summary>Billing Info</summary>
                    <br />
                    <div className="form-line">
                        <div>
                            <label htmlFor="billingCompany">Billing Company</label>
                            <input type="text" id="billingCompany" name="billingCompany" placeholder="Billing Company" required value={data.billingCompany} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="billingAttn">Billing Attention</label>
                            <input type="text" id="billingAttn" name="billingAttn" placeholder="Billing Attention.." required value={data.billingAttn} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-line">
                        <div>
                            <label htmlFor="billingPhone">Billing Phone Number</label>
                            <input type="text" id="billingPhone" name="billingPhone" placeholder="Billing Phone Number.." required value={data.billingPhone} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="billingEmail">Billing Email</label>
                            <input type="email" id="billingEmail" name="billingEmail" placeholder="Billing Email.." required value={data.billingEmail} onChange={handleChange}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="billingAddress1">Billing Address</label>
                        <input type="text" id="billingAddress1" name="billingAddress1" placeholder="Billing Address.." required value={data.billingAddress1} onChange={handleChange}/>
                    </div>
                    <div className="form-line">
                        <div>
                            <label htmlFor="billingAddress2">Billing Address 2</label>
                            <input type="text" id="billingAddress2" name="billingAddress2" placeholder="Address Line 2.." required value={data.billingAddress2} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="billingAddress3">Billing Address 3</label>
                            <input type="text" id="billingAddress3" name="billingAddress3" placeholder="Address Line 3.." required value={data.billingAddress3} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-line">
                        <div>
                            <label htmlFor="billingCity">Billing City</label>
                            <input type="text" id="billingCity" name="billingCity" placeholder="Billing City.." required value={data.billingCity} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="billingState">Billing State</label>
                            <input type="text" id="billingState" name="billingState" placeholder="Billing State.." required value={data.billingState} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-line">
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
                    </div>
                </details>
                <hr />
                <details>
                    <summary>Shipping Info</summary>
                    <br />
                    <div className="form-line">
                        <div>
                            <label htmlFor="shippingCompany">Shipping Company</label>
                            <input type="text" id="shippingCompany" name="shippingCompany" placeholder="Shipping Company" required value={data.shippingCompany} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="shippingAttn">Shipping Attention</label>
                            <input type="text" id="shippingAttn" name="shippingAttn" placeholder="Shipping Attention.." required value={data.shippingAttn} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-line">
                        <div>
                            <label htmlFor="shippingPhone">Shipping Phone Number</label>
                            <input type="text" id="shippingPhone" name="shippingPhone" placeholder="Shipping Phone Number.." required value={data.shippingPhone} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="shippingEmail">Shipping Email</label>
                            <input type="email" id="shippingEmail" name="shippingEmail" placeholder="Shipping Email.." required value={data.shippingEmail} onChange={handleChange}/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="shippingAddress1">Shipping Address</label>
                        <input type="text" id="shippingAddress1" name="shippingAddress1" placeholder="Shipping Address.." required value={data.shippingAddress1} onChange={handleChange}/>
                    </div>
                    <div className="form-line">
                        <div>
                            <label htmlFor="shippingAddress2">Shipping Address 2</label>
                            <input type="text" id="shippingAddress2" name="shippingAddress2" placeholder="Address Line 2.." required value={data.shippingAddress2} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="shippingAddress3">Shipping Address 3</label>
                            <input type="text" id="shippingAddress3" name="shippingAddress3" placeholder="Address Line 3.." required value={data.shippingAddress3} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-line">
                        <div>
                            <label htmlFor="shippingCity">Shipping City</label>
                            <input type="text" id="shippingCity" name="shippingCity" placeholder="Shipping City.." required value={data.shippingCity} onChange={handleChange}/>
                        </div>
                        <div>
                            <label htmlFor="shippingState">State</label>
                            <input type="text" id="shippingState" name="shippingState" placeholder="Shipping State.." required value={data.shippingState} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-line">
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
                    </div>
                </details>
                <hr />
                <div className="form-line">
                    <div>
                        <label htmlFor="orderShippingMethod">Shipping Method</label>
                        <input type="text" list="orderShippingMethodList" name="orderShippingMethod" id="orderShippingMethod" value={data.orderShippingMethod} onChange={handleChange}/>
                        <datalist id="orderShippingMethodList">
                            <option>Fed Ex | Ground</option>
                            <option>Fed Ex | Next Day</option>
                            <option>Fed Ex | 3 Day</option>
                            <option>UPS | Ground</option>
                            <option>UPS | Next Day</option>
                            <option>UPS | 3 Day</option>
                            <option>USPS | Priority Mail</option>
                            <option>Freight</option>
                            <option>Will Call</option>
                        </datalist>
                    </div>
                    <div>
                        <label htmlFor="orderShippingCost">Shipping Cost</label>
                        <input type="number" name="orderShippingCost" id="orderShippingCost" defaultValue="0" min="0" value={data.orderShippingCost} onChange={handleChange}/>
                    </div>
                </div>
                {/* tracking information */}
                <div className="form-line">
                    <div>
                        <label htmlFor="trackingNumber">Tracking Number</label>
                        <input type="text" name="trackingNumber" id="trackingNumber" value={data.trackingNumber} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="orderPackaging">Order Packaging</label>
                        <input type="text" list="orderPackagingList" name="orderPackaging" id="orderPackaging" value={data.orderPackaging} onChange={handleChange}/>
                        <datalist id="orderPackagingList">
                            <option>10x10x14 Box | $3.00</option>
                            <option>6x10x12 Box | $2.50</option>
                            <option>4x10x12 Box | $2.00</option>
                            <option>14x10x1 Envelope | $0.75</option>

                        </datalist>
                    </div>
                </div>
                <hr />
                <div>
                    <label htmlFor="dueDate">Due Date</label>
                    <input type="date" name="dueDate" id="dueDate" value={data.dueDate} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="fob">fob</label>
                    <input type="text" name="fob" value={data.fob} onChange={handleChange}/>
                </div>
                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea name="notes" id="notes" value={data.notes} onChange={handleChange}></textarea>
                </div>
                <hr />
                <div>
                    <label htmlFor="orderTaxRate">Tax Rate (%)</label>
                    <input type="number" name="orderTaxRate" id="orderTaxRate" defaultValue="0" min="0" value={data.orderTaxRate} onChange={handleChange}/>
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