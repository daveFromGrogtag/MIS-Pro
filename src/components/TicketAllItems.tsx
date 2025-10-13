import { useState, useEffect } from 'react'
import { db } from '../scripts/firebase/init.ts'
import { doc, getDoc } from 'firebase/firestore'
import Loading from './Loading.tsx'
import Pill from './Pill.tsx'

const TicketAllItems = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState('')
    const [orderData, setOrderData] = useState({})
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

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
                <h1>Order: {order}</h1>
                <a className="print-hide" href={`/edit-order/?order=${order}`}>Back to order {order}</a>
                <section>
                    <h2>Order Info</h2>
                    <div className="section-info">
                        <div style={{ 'display': 'grid', 'gridTemplateColumns': '1fr 1fr' }}>
                            <div style={{ "borderRight": "1px solid black", "marginRight": "5px" }}>
                                <Pill keyName="Client" valueName={orderData.billingCompany} />
                                <Pill keyName="Due Date" valueName={orderData.dueDate} />
                                <Pill keyName="Desc." valueName={orderData.desc} /><br />
                                <Pill keyName="Client Ref 1" valueName={orderData.ref1} />
                                <Pill keyName="Client Ref 2" valueName={orderData.ref2} />
                            </div>
                            <div>
                                <p><b>Notes</b></p>
                                {orderData.notes.split(/\n/g).map((line) => <p>{line}</p>)}
                            </div>
                        </div>
                    </div>
                </section>
                <table>
                    <tr><th>Billing Info</th><th>Shipping Info</th></tr>
                    <tr><td><p>{orderData.billingCompany}<br />
                        {orderData.billingAttn}<br />
                        {orderData.billingAddress1} {orderData.billingAddress2}<br />
                        {orderData.billingCity}, {orderData.billingState} {orderData.billingZip}</p></td><td><p>{orderData.orderShippingMethod}</p>
                            <p>{orderData.shippingCompany}<br />
                                {orderData.shippingAttn}<br />
                                {orderData.shippingAddress1} {orderData.shippingAddress2}<br />
                                {orderData.shippingCity}, {orderData.shippingState} {orderData.shippingZip}</p></td></tr>
                </table>
                <table>
                    <tr><th>#</th><th>Item Name</th><th>Substrate</th><th>Qty</th></tr>
                    {items.map((item, i) => {
                        return (
                            <tr>
                                <td>{i + 1}</td>
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
                        <h1>Order: {order} - Item: {i + 1} | {orderData.billingCompany} | {formatDate(orderData.dueDate)}</h1>
                        <section>
                            <h2>Client Info</h2>
                            <div className="section-info">
                                <Pill keyName="Client" valueName={orderData.billingCompany} />
                                <Pill keyName="Contact" valueName={orderData.billingAttn} />
                                <Pill keyName="Due Date" valueName={formatDate(orderData.dueDate)} />
                                <Pill keyName="Client Ref#1" valueName={orderData.ref1} />
                                <Pill keyName="Client Ref#2" valueName={orderData.ref2} />
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
                                <Pill keyName="Desc." valueName={item.itemProduct} /><Pill keyName="QTY" valueName={item.itemQuantity} />
                                <Pill keyName="Substrate" valueName={item.itemSubstrate} /><Pill keyName="Width" valueName={item.itemWidth + '"'} /><Pill keyName="Height" valueName={item.itemHeight + '"'} /><Pill keyName="Bleed" valueName={item.itemBleed + '"'} />
                                <Pill keyName="Print Mode" valueName={item.itemPrintMode} /><Pill keyName="Print Quality" valueName={item.itemPrintQuality} />
                            </div>
                        </section>
                        <section>
                            <h2>Prepress</h2>
                            <div className="section-info">
                                <Pill keyName="Proofs" valueName={item.itemProof} />
                            </div>
                        </section>
                        <section>
                            <h2>Press</h2>
                            <div className="section-info">
                                <Pill keyName="Press" valueName={item.itemPress} />
                            </div>
                        </section>
                        <section>
                            <h2>Finishing</h2>
                            <div className="section-info">
                                <div style={{ 'display': 'grid', 'gridTemplateColumns': '1fr 1fr' }}>
                                    <div style={{ "borderRight": "1px solid black", "marginRight": "5px" }}>
                                        <Pill keyName="Laminate" valueName={item.itemLaminate} /><br />
                                        <Pill keyName="Cutter" valueName={item.itemCutter} />
                                    </div>
                                    <div>
                                        <p><b>Finishing</b></p>
                                        {item.itemFinishing.split(/\n/g).map((line) => <p>{line}</p>)}
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
                                        {item.itemNotes.split(/\n/g).map((line) => <p>{line}</p>)}
                                    </div>
                                    <div>
                                        <p><b>H. Notes</b></p>
                                        {item.itemHiddenNotes.split(/\n/g).map((line) => <p>{line}</p>)}
                                    </div>
                                </div>
                            </div>
                        </section>
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