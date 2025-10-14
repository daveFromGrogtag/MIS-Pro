import { useState, useEffect } from 'react'
import { db } from '../scripts/firebase/init.ts'
import { doc, getDoc } from 'firebase/firestore'
import Loading from './Loading.tsx'
import Pill from './Pill.tsx'

const TicketItem = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState('')
    const [orderData, setOrderData] = useState({})
    const [items, setItems] = useState([])
    const [itemData, setItemData] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const itemIndex = parseInt(urlParams.get('item')) - 1

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    }

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
        return <Loading />
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
                <h1>Order: {order} - Item: {itemIndex + 1} | {orderData.billingCompany} | {formatDate(orderData.dueDate)}</h1>
                <section>
                    <h2>Client Info</h2>
                    <div className="section-info">
                        <Pill keyName="Client" valueName={orderData.billingCompany} />
                        <Pill keyName="Contact" valueName={orderData.billingAttn} />
                        <Pill keyName="Client" valueName={orderData.billingCompany} />
                        <Pill keyName="Client" valueName={orderData.billingCompany} />
                        <p><b>Client: </b>{orderData.billingCompany} | <b>Contact: </b>{orderData.billingAttn} | <b>Due Date: </b>{formatDate(orderData.dueDate)}</p>
                        <p><b>Client Ref #:</b> {orderData.ref1} {orderData.ref2} | </p>
                        <div className='two-up'>
                            <div>
                                <b>Billing</b>
                                <p>{orderData.billingCompany}<br />
                                    {orderData.billingAttn}<br />
                                    {orderData.billingAddress1} {orderData.billingAddress2}<br />
                                    {orderData.billingCity}, {orderData.billingState} {orderData.billingZip}</p>
                            </div>
                            <div>
                                <b>Shipping</b>
                                <p>{orderData.shippingCompany}<br />
                                    {orderData.shippingAttn}<br />
                                    {orderData.shippingAddress1} {orderData.shippingAddress2}<br />
                                    {orderData.shippingCity}, {orderData.shippingState} {orderData.shippingZip}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <h2>Item Info</h2>
                    <div className="section-info">
                        <Pill keyName="Desc." valueName={itemData.itemProduct} /><Pill keyName="QTY" valueName={itemData.itemQuantity} />
                        <Pill keyName="Substrate" valueName={itemData.itemSubstrate} /><Pill keyName="Width" valueName={itemData.itemWidth + '"'} /><Pill keyName="Height" valueName={itemData.itemHeight + '"'} /><Pill keyName="Bleed" valueName={itemData.itemBleed + '"'} />
                        <Pill keyName="Print Mode" valueName={itemData.itemPrintMode} /><Pill keyName="Print Quality" valueName={itemData.itemPrintQuality} />
                    </div>
                </section>
                <section>
                    <h2>Prepress</h2>
                    <div className="section-info">
                        <Pill keyName="Proofs" valueName={itemData.itemProof} />
                    </div>
                </section>
                <section>
                    <h2>Press</h2>
                    <div className="section-info">
                        <Pill keyName="Press" valueName={itemData.itemPress} />
                    </div>
                </section>
                <section>
                    <h2>Finishing</h2>
                    <div className="section-info">
                        <div style={{ 'display': 'grid', 'gridTemplateColumns': '1fr 1fr' }}>
                            <div style={{ "borderRight": "1px solid black", "marginRight": "5px" }}>
                                <Pill keyName="Laminate" valueName={itemData.itemLaminate} /><br />
                                <Pill keyName="Cutter" valueName={itemData.itemCutter} />
                            </div>
                            <div>
                                <p><b>Finishing</b></p>
                                {itemData.itemFinishing.split(/\n/g).map((line) => <p>{line}</p>)}
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <h2>Shipping</h2>
                    <div className="section-info">
                        <Pill keyName="Method" valueName={orderData.orderShippingMethod} />
                        <Pill keyName="Packaging" valueName={orderData.orderPackaging} />
                    </div>
                </section>
                <section>
                    <h2>Special Instructions</h2>
                    <div className="section-info">
                        <div style={{ 'display': 'grid', 'gridTemplateColumns': '1fr 1fr' }}>
                            <div style={{ "borderRight": "1px solid black", "marginRight": "5px" }}>
                                <p><b>Notes</b></p>
                                {itemData.itemNotes.split(/\n/g).map((line) => <p>{line}</p>)}
                            </div>
                            <div>
                                <p><b>H. Notes</b></p>
                                {itemData.itemHiddenNotes.split(/\n/g).map((line) => <p>{line}</p>)}
                            </div>
                        </div>
                    </div>
                </section>
                <div className='ticket-thumbnail-container'>
                    <img src={itemData.itemThumbnail} alt="Thumbnail Image" />
                </div>
            </div>
        </div>
    )
}

export default TicketItem