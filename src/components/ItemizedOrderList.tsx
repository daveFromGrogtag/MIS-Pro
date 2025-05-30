import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, where } from 'firebase/firestore'
import Loading from "./Loading.tsx"

const ItemizedOrderList = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, 'orders'), where("status", "!=", "closed")));
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
            <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Client</th>
                <th>Prod</th>
                <th>desc.</th>
                <th>notes</th>
                <th>h.notes</th>
                <th>Press</th>
                <th>Sub</th>
                <th>Mode</th>
                <th>Quality</th>
                <th>Proof</th>
                <th>Due</th>
            </tr>
            {data.map((order) => (
                order.items.map((item) => (
                    <tr key={item.id} className={order.status}>
                        <td>{order.id}</td>
                        <td>{order.status}</td>
                        <td>{order.data.client}</td>
                        <td>{item.itemProduct}</td>
                        <td>{order.data.desc}</td>
                        <td>{item.itemNotes}</td>
                        <td>{item.itemHiddenNotes}</td>
                        <td>{item.itemPress}</td>
                        <td>{item.itemSubstrate}</td>
                        <td>{item.itemPrintMode}</td>
                        <td>{item.itemPrintQuality}</td>
                        <td>{item.itemProof}</td>
                        <td>{order.data.dueDate}</td>
                        {/* <td><img src={item.itemThumbnail} alt="image" /></td> */}
                    </tr>

                ))
            ))}
        </table>
    );

}

export default ItemizedOrderList