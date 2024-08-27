import { useEffect, useState } from 'react';
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, doc, getDoc } from 'firebase/firestore'

const ViewOrder = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "orders", urlParams.get('order'))
                const docSnap = await getDoc(docRef)
                // console.log(docSnap.data());
                setOrder(docSnap.data())
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])
    
    if (loading) {
        return <p>loading...</p>
    }

    return (
        <div>
            <h1>{urlParams.get('order')}</h1>
            <h2>Client: {order.data.client}</h2>
            <h2>Description: {order.data.desc}</h2>
            <h2>Due: {order.data.dueDate}</h2>
            <table>
                <thead>
                    <tr><th>Product</th><th>Substrate</th><th>Laminate</th><th>Press</th><th>Quantity</th></tr>
                </thead>
                <tbody>
                    {
                        order.items.map((item) => {
                            return <tr><td>{item.itemProduct}</td><td>{item.itemSubstrate}</td><td>{item.itemLaminate}</td><td>{item.itemPress}</td><td>{item.itemQuantity}</td></tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ViewOrder;