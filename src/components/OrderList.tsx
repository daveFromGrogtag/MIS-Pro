import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, orderBy, where } from 'firebase/firestore'
import Loading from "./Loading.tsx"
import tableSearch from "../scripts/table-search.js"
import CoolTable from "./CoolTable.tsx"

const OrderList = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
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
        let statusArray = Object.keys(statusChecks).filter(key => statusChecks[key]);
        const fetchData = async () => {

            try {
                const querySnapshot = await getDocs(query(collection(db, 'orders'), where('status', 'in', statusArray)));
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(docs);
                // console.log(docs);

            } catch (error) {
                console.error("Error fetching documents: ", error);
            } finally {
                setLoading(false);
            }
        };
        console.log('fetching data...');
        fetchData();
    }, [statusChecks]);


    const getOrderTotal = (order) => {
        let sumTotal = 0
        order.items.map(item => {
            sumTotal += parseFloat(item.itemCost)
        });
        return sumTotal
    }

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


    const dataColumns = [
        {
            header: "ID",
            accessorKey: "id",
        },
        {
            header: "Status",
            accessorKey: "status",
        },
        {
            header: "Client",
            accessorKey: "data.client"
        },
        {
            header: "Desc",
            accessorKey: "data.desc"
        },
        {
            header: "Due",
            accessorKey: "data.dueDate"
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const id = row.original.id;
                return (
                    <>
                        <a title="Edit" href={`/edit-order?order=${id}`}><i className="fa-solid fa-pen-to-square"></i></a><span> </span>
                        <a title="Packing List" href={`/view-packing-slip?order=${id}`}><i className="fa-solid fa-truck-fast"></i></a><span> </span>
                        <a title="Order Line ticket" href={`/ticket-all-items?order=${id}`}><i className="fa-solid fa-ticket"></i></a><span> </span>
                        <a title="Invoice" href={`/view-invoice?order=${id}`}><i className="fa-solid fa-file-invoice-dollar"></i></a><span> </span>
                        <a title="Duplicate Order" href={`/duplicate-order?order=${id}`}><i className="fa-solid fa-copy"></i></a>
                    </>
                );
            },
        },
    ]



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
            <CoolTable data={data} columns={dataColumns} />
        </>
    );

}

export default OrderList