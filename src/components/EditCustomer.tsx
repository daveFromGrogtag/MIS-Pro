import { useState, useEffect } from 'react'
import {db} from '../scripts/firebase/init.ts'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Loading from './Loading.tsx'


const EditCustomer = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [customerName, setCustomerName] = useState("")
    const [customerId, setCustomerId] = useState("")
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const exportToFirebase = () => {
        try {
            updateDoc(doc(db, "customers", urlParams.get('customer')), {
                data,
            }).then(() => {
                alert('customer saved')
            })
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        let payload = {
            ...data,
            [name]: value
        }
        setData(payload)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "customers", urlParams.get('customer'))
                const docSnap = await getDoc(docRef)
                setCustomerId(urlParams.get('customer'))
                setCustomerName(docSnap.data().name)
                setData(docSnap.data().data)
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
            <h1 className="branded-title">Customer not found</h1>
            <h3 className="branded-title">Are you sure this is the right customer?</h3>
            <a href="/customers">Back to customers?</a>
        </>
        )
    }

    return (
        <div>
            <h1 className='branded-title'>{customerName}</h1>
            <h3 className="branded-title">Edit Customer</h3>
            <a href="/customers">Back to customers?</a>

            <div>

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
                    <summary>Shipping Info (Ignore if varies)</summary>
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
            </div>
        <br />
            
        <button onClick={exportToFirebase}>Save Changes</button>
        </div>
    )
}

export default EditCustomer