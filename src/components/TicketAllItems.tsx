import { useState, useEffect } from 'react'
import {db} from '../scripts/firebase/init.ts'
import { doc, getDoc } from 'firebase/firestore'
import Loading from './Loading.tsx'

const TicketAllItems = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState('')
    const [orderData, setOrderData] = useState({})
    const [items, setItems] = useState([])
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
            <div className="full-page-print">
                <h1>Order: {order}</h1>
                <a href={`/edit-order/?order=${order}`}>Back to order {order}</a>
                <div>
                    <p><b>Client: </b>{orderData.dueDate} | <b>Due Date: </b>{orderData.dueDate} | <b>Order Desc: </b>{orderData.desc} | <b>Quantity: </b></p>
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
                <table>
                    <tr><th>#</th><th>Name</th><th>Substrate</th><th>Qty</th></tr>
                    {items.map((item, i) => {
                        return (
                            <tr>
                                <td>{i+1}</td>
                                <td>{item.itemProduct}</td>
                                <td>{item.itemSubstrate}</td>
                                <td>{item.itemQuantity}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
           {items.map((item, i) => {
                return (
                    <div className="full-page-print">
                        <h1>Item: {order}-{i+1}</h1>
                        <hr />
                        <p><b>Product: </b>{item.itemProduct}</p>
                        <p><b>Notes: </b>{item.itemNotes}</p>
                        <p><b>H. Notes: </b>{item.itemHiddenNotes}</p>
                        <p><b>Finishing: </b>{item.itemFinishing}</p>
                        <p><b>Press: </b>{item.itemPress} | <b>Print Mode: </b>{item.itemPrintMode} | <b>Print Quality: </b>{item.itemPrintQuality}</p>
                        <p><b>Cutter: </b>{item.itemCutter}</p>
                        <hr />
                        <p><b>Substrate: </b>{item.itemSubstrate}</p>
                        <p><b>Laminate: </b>{item.itemLaminate}</p>
                        <p><b>Width: </b>{item.itemWidth}" | <b>Height: </b>{item.itemHeight}" | <b>Bleed: </b>{item.itemBleed}"</p>
                        <p><b>Quantity: </b>{item.itemQuantity}</p>
                        <div className='ticket-thumbnail-container'>
                        <img src={item.itemThumbnail} alt="Thumbnail Image" />
                </div>
            </div>
                )
            })}
            
        </div>
    )
}

export default TicketAllItems