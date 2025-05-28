import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, orderBy } from 'firebase/firestore'
import Loading from "./Loading.tsx"
import tableSearch from "../scripts/table-search.js"

const OrderList = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("")
    const [statusChecks, setStatusChecks] = useState({
        open: true,
        closed: false,
        shipped: false,
        processing: true,
        onhold: false,
        pending: true,
        oop: true,
        production: true,
        prepress: true,
        cancelled: false
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, 'orders'), orderBy('orderId', 'desc')));
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

    const handleCheckBoxChange = (e) => {
        const { name, checked } = e.target;
        setStatusChecks({
            ...statusChecks,
            [name]: checked
        })
    }

    if (loading) {
        return <Loading />
    }

    function orderTableFilter(columnsToCheck, currentStatus) {
        let columnsString = columnsToCheck.join("").toString().toLowerCase()
        if (statusChecks[currentStatus] === false) {
            return "hideIt"
        }
        if (columnsString.includes(search.toLowerCase())) {
            return ""
        } else {
            return "hideIt"
        }
    }

    return (
        <>
        <div className="statusCheckBoxContainer">
            <label>
                <input
                    type="checkbox"
                    name="open"
                    checked={statusChecks.open}
                    onChange={handleCheckBoxChange}
                />
                Open
            </label>
            <label>
                <input
                    type="checkbox"
                    name="processing"
                    checked={statusChecks.processing}
                    onChange={handleCheckBoxChange}
                />
                Processing
            </label>
            <label>
                <input
                    type="checkbox"
                    name="pending"
                    checked={statusChecks.pending}
                    onChange={handleCheckBoxChange}
                />
                Pending
            </label>
            <label>
                <input
                    type="checkbox"
                    name="oop"
                    checked={statusChecks.oop}
                    onChange={handleCheckBoxChange}
                />
                Out on Proof
            </label>
            <label>
                <input
                    type="checkbox"
                    name="prepress"
                    checked={statusChecks.prepress}
                    onChange={handleCheckBoxChange}
                />
                Prepress
            </label>
            <label>
                <input
                    type="checkbox"
                    name="production"
                    checked={statusChecks.production}
                    onChange={handleCheckBoxChange}
                />
                Production
            </label>
            <label>
                <input
                    type="checkbox"
                    name="cancelled"
                    checked={statusChecks.cancelled}
                    onChange={handleCheckBoxChange}
                />
                Cancelled
            </label>
            <label>
                <input
                    type="checkbox"
                    name="closed"
                    checked={statusChecks.closed}
                    onChange={handleCheckBoxChange}
                />
                Closed
            </label>
            <label>
                <input
                    type="checkbox"
                    name="shipped"
                    checked={statusChecks.shipped}
                    onChange={handleCheckBoxChange}
                />
                Shipped
            </label>
            
            <label>
                <input
                    type="checkbox"
                    name="onhold"
                    checked={statusChecks.onhold}
                    onChange={handleCheckBoxChange}
                />
                OnHold
            </label>
        </div>
            <table>
                <thead>
                    <tr><th colSpan={7}>
                        <input
                            className="orderListSearchBar"
                            type="text"
                            placeholder="SEARCH?"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value) }} />
                    </th></tr>
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
                        <tr key={order.id} className={orderTableFilter([order.id, order.data.client, order.data.desc], order.status)}>
                            <td>{order.id}</td>
                            <td>{order.status}</td>
                            <td>{order.data.client}</td>
                            <td>{order.data.desc}</td>
                            <td>{order.data.dueDate}</td>
                            <td>${order.total ? order.total.toFixed(2) : 0}</td>
                            <td>
                                <a href={`/edit-order?order=${order.id}`}>Edit</a> |
                                <a href={`/view-packing-slip?order=${order.id}`}>Pack</a> |
                                <a href={`/ticket-order?order=${order.id}`}>Ticket</a> |
                                <a href={`/view-invoice?order=${order.id}`}>Invoice</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

}

export default OrderList