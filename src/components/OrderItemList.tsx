import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, orderBy, where } from 'firebase/firestore'
import Loading from "./Loading.tsx"
import tableSearch from "../scripts/table-search.js"
import CoolTable from "./CoolTable.tsx"


const OrderItemList = () => {
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

    const handleCheckBoxChange = (e) => {
        const { name, checked } = e.target;
        setStatusChecks({
            ...statusChecks,
            [name]: checked
        })
    }

        const flattenedData = data.flatMap((eachOrder) =>
        eachOrder.items.map((item, index) => ({
            itemIndex: index + 1,
            orderId: eachOrder.id,
            status: eachOrder.status,
            client: eachOrder.data.client,
            desc: eachOrder.data.desc,
            dueDate: eachOrder.data.dueDate,
            product: item.itemProduct,
            press: item.itemPress,
            substrate: item.itemSubstrate,
            qty: item.itemQuantity,
            thumbnailUrl: item.itemThumbnail
        }))
    );

    if (loading) {       
        return <Loading />
    }

        const dataColumns = [
        {
            header: "OrderID",
            accessorKey: "orderId",
        },
        {
            header: "ItemID",
            accessorKey: "itemIndex",
        },
        {
            header: "Status",
            accessorKey: "status",
        },
        {
            header: "Client",
            accessorKey: "client"
        },
        {
            header: "Order Desc",
            accessorKey: "desc"
        },
        {
            header: "Due",
            accessorKey: "dueDate"
        },
        {
            header: "Product",
            accessorKey: "product"
        },
        {
            header: "press",
            accessorKey: "press"
        },
        {
            header: "substrate",
            accessorKey: "substrate"
        },
        {
            header: "qty",
            accessorKey: "qty"
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const id = row.original.orderId;
                const itemId = row.original.itemIndex;
                return (
                    <>
                    <button title="Edit Item"><a href={`/edit-item?order=${id}&item=${itemId}`}><i className="fa-solid fa-pen-to-square"></i></a></button>
                    <button title="Item Ticket"><a href={`/ticket-item?order=${id}&item=${itemId}`}><i className="fa-solid fa-ticket"></i></a></button>
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
            <CoolTable data={flattenedData} columns={dataColumns} />
        </>
    );

}

export default OrderItemList