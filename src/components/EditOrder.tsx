import { useState, useEffect } from 'react'
import {db} from '../scripts/firebase/init.ts'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import OrderInfo from './OrderInfo'
import ItemList from './ItemList'
import Loading from './Loading.tsx'
import totalCalculator from '../scripts/totalCalculator.js'


const EditOrder = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState('')
    const [data, setData] = useState({})
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState('open')
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    const handleStatusChange = (e) => {
        setStatus(e.target.value)        
    }

    const exportToFirebase = () => {
        try {
            updateDoc(doc(db, "orders", urlParams.get('order')), {
                data,
                items,
                total,
                status
            }).then(() => {
                alert('order saved')
            })
        } catch (error) {
            console.error(error);
        }
    }

    const getOrderTotal = () => {
        console.log(items);
        
        let sumTotal = 0
        items.map(item => {
            sumTotal += parseFloat(item.itemCost)
        });
        setTotal(sumTotal)
    }

    useEffect(() => {
        getOrderTotal()
    },[items, data])

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
            <h1 className="branded-title">Order not found</h1>
            <h3 className="branded-title">Are you sure this is the right order number?</h3>
            <a href="/orders">Back to orders</a>
        </>
        )
    }

    return (
        <div>
            <h1>Order: {order}</h1>
            <table id='order-pricing-table'>
                <tr><td>Cost</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).cost.toFixed(2)}</td></tr>
                <tr><td>Tax</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientTax.toFixed(2)}</td></tr>
                <tr><td>Shipping</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).shippingCost.toFixed(2)}</td></tr>
                <tr><td>Shipping MU</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientShipping.toFixed(2)}</td></tr>
                <tr><td>Total MU</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientTotalWithTaxAndShipping.toFixed(2)}</td></tr>
                <tr><td>Total + MU - D</td><td>${totalCalculator(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientTotalWithDiscount.toFixed(2)}</td></tr>
            </table>
            <label htmlFor="status">Status:</label>
            <select name="status" id="status" onChange={handleStatusChange} defaultValue={status}>
                <option value="closed">closed</option>
                <option value="processing">processing</option>
                <option value="open">open</option>
                <option value="on-hold">on-hold</option>
            </select>
            <OrderInfo data={data} setData={setData}/>
            <ItemList items={items} setItems={setItems}/>
        <button onClick={exportToFirebase}>Save Changes</button>
        </div>
    )
}

export default EditOrder