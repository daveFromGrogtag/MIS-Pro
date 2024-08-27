import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs } from 'firebase/firestore'
import Loading from "./Loading.tsx"

const OrderList = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, 'orders')));
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(docs);
                console.log(docs);

            } catch (error) {
                console.error("Error fetching documents: ", error);
            } finally {
                setLoading(false);
            }
        };
        console.log('fetching data...');
        fetchData();
    }, []);

    if (loading) {
        return <Loading/>
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Status</th>
                    <th>Client</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {data.map((order) => (
                <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.status}</td>
                    <td>{order.data.client}</td>
                    <td>{order.data.desc}</td>
                    <td>{order.data.dueDate}</td>
                    <td>${order.total?order.total:0}</td>
                    <td>
                        <a href={`/edit-order?order=${order.id}`}>Edit</a> | 
                        <a href={`/view-order?order=${order.id}`}>Pack List</a> | 
                        <a href={`/edit-order?order=${order.id}`}>Invoice</a>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );

}

export default OrderList