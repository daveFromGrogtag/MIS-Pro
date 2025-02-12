import { useState } from "react";
import {db} from '../scripts/firebase/init.ts'
import { doc, setDoc } from 'firebase/firestore'

const AddNewCustomer = () => {
    const [customerName, setCustomerName] = useState("")
    const [customerId, setCustomerId] = useState("")
    const [customerData, setCustomerData] = useState({})
    const [formVisibility, setFormVisibility] = useState(false)

    const createNewCustomer = () => {
            try {
                setDoc(doc(db, "customers", customerId), {
                    name: customerName,
                    customerId,
                    data: customerData
                }).then(() => {
                    alert('new customer added')
                    window.location.href = `/edit-customer?customer=${customerId}`
                })
            } catch (error) {
                console.error(error);
                
            }
        }

    function toCamelCase(str) {
        return str
            .replace(/[^a-zA-Z0-9 ]/g, '') // Remove special characters
            .split(' ') // Split by spaces
            .map((word, index) => 
                index === 0 
                    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
                    : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join('');
    }

    const showForm = (e) => {
        setFormVisibility(true)
    }

    const logName = (e) => {
        console.log(customerId); 
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setCustomerName(value)
        setCustomerId(toCamelCase(value))
    }

    return <>
        <button onClick={showForm}>Add New Customer +</button>
        { formVisibility && (
            <div id="new-customer-form">
            <div className="form-line">
                <div>
                    <label htmlFor="customerName">Customer Name</label>
                    <input type="text" id="customerName" name="customerName" placeholder="customer name" required value={customerName} onChange={handleChange}/>
                </div>
            </div>
            <br />
            <button onClick={createNewCustomer}>Save</button>
            </div>
        )
            }
    </>
}

export default AddNewCustomer