import { useState, useEffect } from 'react'
import { db } from '../scripts/firebase/init.ts'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import OrderInfo from './OrderInfo'
import ItemList from './ItemList'
import Loading from './Loading.tsx'
import totalCalculator from '../scripts/totalCalculator.js'
import { auth } from '../scripts/firebase/init.ts'
import { onAuthStateChanged } from 'firebase/auth';


const EditOrder = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState('')
    const [data, setData] = useState({})
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [taxableTotal, setTaxableTotal] = useState(0)
    const [status, setStatus] = useState('open')
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [statusLog, setStatusLog] = useState([])

    const handleStatusChange = (e) => {
        setStatus(e.target.value)
        statusLogger(status, e.target.value)
    }

    function getCurrentUserEmail() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, (user) => {
                resolve(user ? user.email : null);
            });
        });
    }

    async function statusLogger(oldStatus, newStatus) {
        const currentUserEmail = await getCurrentUserEmail()
        const currentDateTime = new Date()
        let logEntry = `${currentDateTime.toLocaleString()} - ${currentUserEmail} - ${oldStatus} => ${newStatus}`
        let newLog = [...statusLog, logEntry]
        setStatusLog(newLog)
    }

    const exportToFirebase = () => {
        try {
            updateDoc(doc(db, "orders", urlParams.get('order')), {
                data,
                items,
                total,
                status,
                statusLog
            }).then(() => {
                alert('order saved')
            })
        } catch (error) {
            console.error(error);
        }
    }

    const getOrderTotal = () => {
        let sumTotal = 0
        let taxTotal = 0
        items.map(item => {
            if (item.itemTaxable === undefined || item.itemTaxable === true) {
                taxTotal += parseFloat(item.itemCost)
            }
            sumTotal += parseFloat(item.itemCost)
        });
        setTotal(sumTotal)
        setTaxableTotal(taxTotal)
    }

    useEffect(() => {
        getOrderTotal()
    }, [items, data])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "orders", urlParams.get('order'))
                const docSnap = await getDoc(docRef)
                setOrder(urlParams.get('order'))
                setData(docSnap.data().data)
                setItems(docSnap.data().items)
                setTotal(docSnap.data().total)
                setStatus(docSnap.data().status)
                docSnap.data().statusLog?setStatusLog(docSnap.data().statusLog):setStatusLog([])

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
        return <Loading />
    }

    if (notFound) {
        return (<>
            <h1 className="branded-title">Order not found</h1>
            <h3 className="branded-title">Are you sure this is the right order number?</h3>
            <a href="/orders">Back to orders</a>
        </>
        )
    }

    return (
        <div>
            <h1>Order: {order}</h1>
            <div className='edit-order-page-links'>
                <a href={`/duplicate-order?order=${order}`}>Duplicate Order</a><br />
                <b>Downloads: </b>
                <a href={`/ticket-all-items?order=${order}`}>Ticket</a>
                <a href={`/view-packing-slip?order=${order}`}>Packing List</a>
                <a href={`/view-invoice?order=${order}`}>Invoice</a>
            </div>
            <table id='order-pricing-table'>
                <tr><td>Cost</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount, taxableTotal).cost.toFixed(2)}</td></tr>
                <tr><td>Tax</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount, taxableTotal).clientTax.toFixed(2)}</td></tr>
                <tr><td>Shipping</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount, taxableTotal).shippingCost.toFixed(2)}</td></tr>
                <tr><td>Shipping MU</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount, taxableTotal).clientShipping.toFixed(2)}</td></tr>
                <tr><td>Total MU</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount, taxableTotal).clientTotalWithTaxAndShipping.toFixed(2)}</td></tr>
                <tr><td>Total + MU - D</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount, taxableTotal).clientTotalWithDiscount.toFixed(2)}</td></tr>
            </table>
            <label htmlFor="status">Status:</label>
            <select name="status" id="status" onChange={handleStatusChange} defaultValue={status}>
                <option value="open">open</option>
                <option value="pending">pending</option>
                <option value="oop">out on proof</option>
                <option value="prepress">prepress</option>
                <option value="production">production</option>
                <option value="processing">processing</option>
                <option value="shipped">shipped</option>
                <option value="cancelled">cancelled</option>
                <option value="onhold">on-hold</option>
                <option value="closed">closed</option>
            </select>
            <OrderInfo data={data} setData={setData} />
            <ItemList items={items} setItems={setItems} orderId={order} />
            <button onClick={exportToFirebase}>Save Changes</button>
            <p>
                {statusLog.map((line) => <li>{line}</li>)}
            </p>
        </div>
    )
}

export default EditOrder