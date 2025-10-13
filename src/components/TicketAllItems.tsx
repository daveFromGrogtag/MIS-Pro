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
                <div>

                    {/* <p><b>Client: </b>{orderData.dueDate} | <b>Due Date: </b>{orderData.dueDate} | <b>Order Desc: </b>{orderData.desc} | <b>Client Ref #:</b> {orderData.ref1} {orderData.ref2} | </p> */}
                </div>
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
                        {/* <table>
                            <thead>
                                <tr>
                                    <th>Job Ticket</th>
                                    <th>Customer</th>
                                    <th>Due Date</th>
                                    <th>Thumb</th>
                                </tr>
                                <tr>
                                    <td><h1>{order}-{i+1}</h1></td>
                                    <td><h1>{orderData.billingCompany}</h1></td>
                                    <td><h1>{orderData.dueDate}</h1></td>
                                    <td><img src={item.itemThumbnail} alt="Thumbnail Image" /></td>
                                </tr>
                            </thead>
                        </table>
                        <table>
                            <tr>
                                <th>Contact</th><td>{orderData.billingAttn}</td><th>Phone</th><td>{orderData.billingPhone}</td>
                            </tr>
                            <tr>
                                <th>Address</th><td>{orderData.billingAddress1} {orderData.billingAddress2}</td><th>Email</th><td>{orderData.billingEmail}</td>
                            </tr>
                        </table>
                        <table>
                            <tr><th colSpan={3}>Job Description</th></tr>
                            <tr><td>QTY: {item.itemQuantity}</td><td>Size: {item.itemWidth}" X {item.itemHeight}" <small>(bleed: {item.itemBleed}")</small></td><td>Machine: {item.itemPress} {item.itemPrintMode}</td></tr>
                            <tr><td>Stock: {item.itemSubstrate}</td><td>Mode: {item.itemPrintMode}</td><td>Quality: {item.itemPrintQuality}</td></tr>
                        </table>
                        <table>
                            <tr><th colSpan={3}>Prepress</th></tr>
                            <tr><td>Name: {item.itemProduct}</td><td>Proofs: {item.itemProof}</td></tr>
                            <tr><th colSpan={3}>Notes</th></tr>
                            <tr><td colSpan={3}>{item.itemNotes}</td></tr>
                            <tr><th colSpan={3}>Internal Notes</th></tr>
                            <tr><td colSpan={3}>{item.itemHiddenNotes}</td></tr>
                            
                        </table>
                        <table>
                            <tr><th colSpan={3}>Finishing</th></tr>
                            <tr><td>Laminate: {item.itemLaminate}</td><td>Cutter: {item.itemCutter}</td><td>Finishing: {item.itemFinishing}</td></tr>
                        </table>
                        <table>
                            <tr><th>Shipping (Packaging)</th></tr>
                            <tr><td>Packaging: {orderData.orderPackaging}</td></tr>
                            <tr><td>Method:{orderData.orderShippingMethod}</td></tr>
                        </table> */}

                        {/* <h1>Item: {order}-{i + 1}</h1>
                        <hr />
                        <h2>Client Info</h2>
                        <div>
                            <p><b>Client: </b>{orderData.billingCompany} | <b>Due Date: </b>{orderData.dueDate}</p>
                        </div>

                        <div className='address-container'>
                            <div>
                                <b>Billing Info</b>
                                <p>{orderData.billingCompany}<br />
                                    {orderData.billingAttn}<br />
                                    {orderData.billingAddress1} {orderData.billingAddress2}<br />
                                    {orderData.billingCity}, {orderData.billingState} {orderData.billingZip}</p>
                            </div>
                            <div>
                                <b>Shipping Info</b>
                                <p>{orderData.orderShippingMethod}</p>
                                <p>{orderData.shippingCompany}<br />
                                    {orderData.shippingAttn}<br />
                                    {orderData.shippingAddress1} {orderData.shippingAddress2}<br />
                                    {orderData.shippingCity}, {orderData.shippingState} {orderData.shippingZip}</p>
                            </div>
                        </div>
                        <hr />
                        <p><b>Desc: </b>{item.itemProduct}</p>
                        <p><b>Width: </b>{item.itemWidth}" | <b>Height: </b>{item.itemHeight}" | <b>Bleed: </b>{item.itemBleed}"</p>
                        <hr />
                        <p><b>Quantity: </b>{item.itemQuantity}</p>
                        <p><b>Substrate: </b>{item.itemSubstrate}</p>
                        <p><b>Print Mode: </b>{item.itemPrintMode}</p>
                        <p><b>Print Quality: </b>{item.itemPrintQuality}</p>
                        <hr />
                        <h2>Prepress</h2>
                        <p><b>Proofs: </b>{item.itemProof}</p>
                        <hr />
                        <h2>Press</h2>
                        <p><b>Press: </b>{item.itemPress}</p>
                        <hr />
                        <h2>Finishing</h2>
                        <p><b>Laminate: </b>{item.itemLaminate}</p>
                        <p><b>Cutter: </b>{item.itemCutter}</p>
                        <p><b>Finishing: </b>{item.itemFinishing}</p>
                        <hr />
                        <h2>Shipping</h2>
                        <p><b>Shipping:</b> </p>
                        <p><b>Packaging:</b> {orderData.orderPackaging}</p>
                        <p><b>Method:</b> {orderData.orderShippingMethod}</p>
                        <hr />
                        <h2>Special Instructions</h2>
                        <p><b>Notes: </b>{item.itemNotes}</p>
                        <p><b>H. Notes: </b>{item.itemHiddenNotes}</p>
                        <hr />
                        <div className='ticket-thumbnail-container'>
                            <img src={item.itemThumbnail} alt="Thumbnail Image" />
                        </div> */}


                        {/* <h1>Item: {order}-{i + 1}</h1>
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
                        </div> */}


                        <h1>Order: {order} - Item: {i + 1} | {orderData.billingCompany} | {orderData.dueDate}</h1>
                        <section>
                            <h2>Client Info</h2>
                            <div className="section-info">
                                <Pill keyName="Client" valueName={orderData.billingCompany} />
                                <Pill keyName="Contact" valueName={orderData.billingAttn} />
                                <Pill keyName="Client" valueName={orderData.billingCompany} />
                                <Pill keyName="Client" valueName={orderData.billingCompany} />
                                <p><b>Client: </b>{orderData.billingCompany} | <b>Contact: </b>{orderData.billingAttn} | <b>Due Date: </b>{orderData.dueDate}</p>
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
                                <Pill keyName="Desc." valueName={item.itemProduct} /><Pill keyName="QTY" valueName={item.itemQuantity} />
                                <Pill keyName="Substrate" valueName={item.itemSubstrate} /><Pill keyName="Width" valueName={item.itemWidth + '"'} /><Pill keyName="Height" valueName={item.itemHeight + '"'} /><Pill keyName="Bleed" valueName={item.itemBleed + '"'} />
                                <Pill keyName="Print Mode" valueName={item.itemPrintMode} /><Pill keyName="Print Quality" valueName={item.itemPrintQuality} />
                                {/* <p><b>Desc: </b>{item.itemProduct} | <b>Quantity: </b>{item.itemQuantity}</p> */}
                                {/* <p><b>Width: </b>{item.itemWidth}" | <b>Height: </b>{item.itemHeight}" | <b>Bleed: </b>{item.itemBleed}"</p> */}
                                {/* <p><b>Substrate: </b>{item.itemSubstrate}</p> */}
                                {/* <p><b>Print Mode: </b>{item.itemPrintMode} | <b>Print Quality: </b>{item.itemPrintQuality}</p> */}
                            </div>
                        </section>
                        <section>
                            <h2>Prepress</h2>
                            <div className="section-info">
                                <Pill keyName="Proofs" valueName={item.itemProof} />
                                {/* <p><b>Proofs: </b>{item.itemProof}</p> */}
                            </div>
                        </section>
                        <section>
                            <h2>Press</h2>
                            <div className="section-info">
                                <Pill keyName="Press" valueName={item.itemPress} />
                                {/* <p><b>Press: </b>{item.itemPress}</p> */}
                            </div>
                        </section>
                        <section>
                            <h2>Finishing</h2>
                            <div className="section-info">
                                <div style={{ 'display': 'grid', 'gridTemplateColumns': '1fr 1fr' }}>
                                    <div style={{"borderRight": "1px solid black", "marginRight": "5px"}}>
                                <Pill keyName="Laminate" valueName={item.itemLaminate} /><br/>
                                <Pill keyName="Cutter" valueName={item.itemCutter} />
                                    </div>
                                    <div>
                                <p><b>Finishing</b></p>
                                {item.itemFinishing.split(/\n/g).map((line) => <p>{line}</p>)}
                                    </div>
                                </div>
                                {/* <p><b>Laminate: </b>{item.itemLaminate} | <b>Cutter: </b>{item.itemCutter}</p>
                                    <p><b>Finishing: </b>{item.itemFinishing}</p> */}
                            </div>
                        </section>
                        <section>
                            <h2>Shipping</h2>
                            <div className="section-info">
                                <Pill keyName="Method" valueName={orderData.orderShippingMethod} />
                                <Pill keyName="Packaging" valueName={orderData.orderPackaging} />
                                {/* <p><b>Method:</b> {orderData.orderShippingMethod}</p>
                                    <p><b>Packaging:</b> {orderData.orderPackaging}</p> */}
                            </div>
                        </section>
                        <section>
                            <h2>Special Instructions</h2>
                            <div className="section-info">
                                <div style={{ 'display': 'grid', 'gridTemplateColumns': '1fr 1fr' }}>
                                    <div style={{"borderRight": "1px solid black", "marginRight": "5px"}}>
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