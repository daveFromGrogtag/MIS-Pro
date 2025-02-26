import { useState, useEffect } from 'react'
import {db} from '../scripts/firebase/init.ts'
import { doc, getDoc } from 'firebase/firestore'
import Loading from './Loading.tsx'

const TicketItem = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState('')
    const [orderData, setOrderData] = useState({})
    const [items, setItems] = useState([])
    const [itemData, setItemData] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const itemIndex = parseInt(urlParams.get('item')) - 1

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "orders", urlParams.get('order'))
                const docSnap = await getDoc(docRef)
                setOrder(urlParams.get('order'))
                setOrderData(docSnap.data().data)
                setItems(docSnap.data().items)
                setItemData(docSnap.data().items[itemIndex])
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
            <h1 className="branded-title">Item not found</h1>
            <h3 className="branded-title">Are you sure this is the right order/item number?</h3>
            <a href="/orders">Back to orders</a>
        </>
        )
    }

    return (
        <div className='job-ticket'>
            <h1>Item: {order}-{itemIndex+1}</h1>
            <a href={`/edit-order/?order=${order}`}>Back to order {order}</a>
            <div>
                <div>
                    <p><b>Client: </b>{orderData.dueDate} | <b>Due Date: </b>{orderData.dueDate} | <b>Order Desc: </b>{orderData.desc} | <b>Quantity: </b>{itemData.itemQuantity}</p>
                </div>
                <div className='address-container'>
                    <div>
                    <b>Billing Info</b>
                    <p>{orderData.billingCompany}<br/>
                    {orderData.billingAttn}<br/>
                    {orderData.billingAddress1} {orderData.billingAddress2}<br/>
                    {orderData.billingCity}, {orderData.billingState} {orderData.billingZip}</p>
                    </div>
                    <div>
                    <b>Shipping Info</b>
                    <p>{orderData.orderShippingMethod}</p>
                    <p>{orderData.shippingCompany}<br/>
                    {orderData.shippingAttn}<br/>
                    {orderData.shippingAddress1} {orderData.shippingAddress2}<br/>
                    {orderData.shippingCity}, {orderData.shippingState} {orderData.shippingZip}</p>
                    </div>
                </div>
            </div>
            <div>
                <p><b>Product: </b>{itemData.itemProduct}</p>
                <p><b>Press: </b>{itemData.itemPress} | <b>Print Mode: </b>{itemData.itemPrintMode} | <b>Print Quality: </b>{itemData.itemPrintQuality}</p>
                <p><b>Cutter: </b>{itemData.itemCutter}</p>
                <hr />
                <p><b>Substrate: </b>{itemData.itemSubstrate}</p>
                <p><b>Laminate: </b>{itemData.itemLaminate}</p>
                <p><b>Width: </b>{itemData.itemWidth}" | <b>Height: </b>{itemData.itemHeight}" | <b>Bleed: </b>{itemData.itemBleed}"</p>
                <p><b>Quantity: </b>{itemData.itemQuantity}</p>
                <div className='ticket-thumbnail-container'>
                <img src={itemData.itemThumbnail} alt="Thumbnail Image" />
                </div>
            </div>
        </div>
    )
}

export default TicketItem