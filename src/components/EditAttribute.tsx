import { useState, useEffect } from 'react'
import {db} from '../scripts/firebase/init.ts'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Loading from './Loading.tsx'
import CostConverter from './CostConverter.tsx'


const EditAttribute = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [attributeName, setAttributeName] = useState("")
    const [attrributeId, setAttributeId] = useState("")
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const exportToFirebase = () => {
        try {
            updateDoc(doc(db, urlParams.get('category'), urlParams.get('attributeId')), {
                costPerSquareInch: data.costPerSquareInch || 0,
                timePerSquareInch: data.timePerSquareInch || 0,
                notes: data.notes || ""
            }).then(() => {
                alert('attribute saved')
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
                const docRef = doc(db, urlParams.get('category'), urlParams.get('attributeId'))
                const docSnap = await getDoc(docRef)
                setAttributeId(urlParams.get('attributeId'))
                setAttributeName(docSnap.data().name)
                setData(docSnap.data())
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
            <h1 className="branded-title">Attributes not found</h1>
            <h3 className="branded-title">Are you sure this is the right attributes?</h3>
            <a href="/substrates">Back to attributes?</a>
        </>
        )
    }

    return (
        <div>
            <h1 className='branded-title'>{attributeName}</h1>
            <h3 className="branded-title">Edit Attribute</h3>
            <a href="/substrates">Back to attributes?</a>
        <br />
        <details>
            <summary>Instructions</summary>
            If you have the cost or time in Square feet, divide it by 144 for the cost per square inch.
            <br />
            Same deal with time.
            <br />
            <CostConverter />
            <br />
        </details>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <div>
                                    <label htmlFor="costPerSquareInch">Cost Per Square Inch</label>
                                    <input
                                        type="number"
                                        name="costPerSquareInch"
                                        id="costPerSquareInch"
                                        value={data.costPerSquareInch}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="timePerSquareInch">Time Per Square Inch (Seconds)</label>
                                    <input
                                        type="number"
                                        name="timePerSquareInch"
                                        id="timePerSquareInch"
                                        value={data.timePerSquareInch}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="notes">Notes</label>
                                    <textarea name="notes" id="notes" value={data.notes} onChange={handleChange}></textarea>
                                </div>
                            </div>
                        </div>
        <button onClick={exportToFirebase}>Save Changes</button>
        </div>
    )
}

export default EditAttribute