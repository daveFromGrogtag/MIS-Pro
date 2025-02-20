import { useState } from "react";
import {db} from '../scripts/firebase/init.ts'
import { doc, setDoc } from 'firebase/firestore'

const AddNewAttribute = ({category}) => {
    const [attributeName, setAttributeName] = useState("")
    const [attributeId, setAttributeId] = useState("")
    const [formVisibility, setFormVisibility] = useState(false)

    const createNewAttribute = () => {
            try {
                setDoc(doc(db, category, attributeId), {
                    name: attributeName,
                    id: attributeId
                }).then(() => {
                    alert('new attribute added')
                    window.location.href = `/edit-attribute?category=${category}&attributeId=${attributeId}`
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
        console.log(attributeId); 
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setAttributeName(value)
        setAttributeId(toCamelCase(value))
    }

    return <>
        <button onClick={showForm}>Add New {category} +</button>
        { formVisibility && (
            <div id="new-customer-form">
            <div className="form-line">
                <div>
                    <label htmlFor="attributeName">Attribute Name</label>
                    <input type="text" id="attributeName" name="attributeName" placeholder="attribute name" required value={attributeName} onChange={handleChange}/>
                </div>
            </div>
            <br />
            <button onClick={createNewAttribute}>Save</button>
            </div>
        )
            }
    </>
}

export default AddNewAttribute