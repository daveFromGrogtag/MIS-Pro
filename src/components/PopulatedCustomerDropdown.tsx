import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs } from 'firebase/firestore'

const PopulatedCustomerDropdown = ({inputType}) => {
    const [listOptions, setListOptions] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, inputType)));
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setListOptions(docs);
                console.log(docs);
            } catch  {

            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <option value="">LOADING...</option>
    }

    return (
        <>
            <option>-</option>
            {listOptions.map((listOption, index) => (
                <option key={index} value={listOption.name}>Autofill</option>
            ))}
        </>
    )
}

export default PopulatedCustomerDropdown