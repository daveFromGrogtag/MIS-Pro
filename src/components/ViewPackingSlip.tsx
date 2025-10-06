import { useEffect, useState } from 'react';
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, doc, getDoc } from 'firebase/firestore'

const ViewPackingSlip = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const [order, setOrder] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "orders", urlParams.get('order'))
                const docSnap = await getDoc(docRef)
                // console.log(docSnap.data());
                setOrder(docSnap.data())
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <p>loading...</p>
    }

    return (
        <div>
            <h1>Packing Slip {urlParams.get('order')}</h1>
            <table>
                <tr><th colSpan={2}>Order Info</th></tr>
                <tr><td>Reference 1</td><td>{order.data.ref1}</td></tr>
                <tr><td>Reference 2</td><td>{order.data.ref2}</td></tr>
                <tr><td>Client</td><td>{order.data.client}</td></tr>
                <tr><td>Description</td><td>{order.data.desc}</td></tr>
                <tr><td>Due date:</td><td>{order.data.dueDate}</td></tr>
            </table>
            <table>
                
                <tr><th>Notes<input type="checkbox"/><span className='hide-notes'>Check to show in printout</span></th></tr>
                <tr><td><textarea name="packing-notes" id="packing-notes"></textarea></td></tr>
            </table>
            <table>
                <tr>
                    <th>Billing</th><th>Shipping</th>
                </tr>
                <tr>
                    <td>
                        {order.data.billingCompany}<br />
                        {order.data.billingAttn}<br />
                        {order.data.billingAddress1}<br />
                        {order.data.billingAddress2}<br />
                        {order.data.billingAddress3}<br />
                        {order.data.billingCity}<br />
                        {order.data.billingState}<br />
                        {order.data.billingZip}<br />
                        {order.data.billingCountry}<br />
                        {order.data.billingEmail}<br />
                        {order.data.billingPhone}<br />

                    </td>
                    <td>
                        {order.data.shippingCompany}<br />
                        {order.data.shippingAttn}<br />
                        {order.data.shippingAddress1}<br />
                        {order.data.shippingAddress2}<br />
                        {order.data.shippingAddress3}<br />
                        {order.data.shippingCity}<br />
                        {order.data.shippingState}<br />
                        {order.data.shippingZip}<br />
                        {order.data.shippingCountry}<br />
                        {order.data.shippingEmail}<br />
                        {order.data.shippingPhone}<br />
                    </td>
                </tr>
            </table>
            <table>
                <thead>
                    <tr><th>#</th><th>Product</th><th>Substrate</th><th>Laminate</th><th>Press</th><th>Quantity</th><th>Thumb</th><th className='row-hider'>Hide</th></tr>
                </thead>
                <tbody>
                    {
                        order.items.map((item, index) => {
                            return <tr className='packing-list-row'>
                                <td>{index + 1}</td>
                                <td>{item.itemProduct}</td>
                                <td>{item.itemSubstrate}</td>
                                <td>{item.itemLaminate}</td>
                                <td>{item.itemPress}</td>
                                <td><input type="number" className='qty-changer' name="qty-changer" defaultValue={item.itemQuantity}/></td>
                                <td><img src={item.itemThumbnail} alt="no-image" /></td>
                                <td className='row-hider'><input type="checkbox" name="hider"/></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            {/* <table>
                <thead>
                    <tr><th>#</th><th>Product</th><th>notes</th><th>Quantity</th><th>Thumb</th></tr>
                </thead>
                <tbody>
                    {
                        order.items.map((item, index) => {
                            return <tr>
                                <td>{index + 1}</td>
                                <td>{item.itemProduct}</td>
                                <td>{item.itemNotes}</td>
                                <td>{item.itemQuantity}</td>
                                <td><img src={item.itemThumbnail} alt="no-image" /></td>
                            </tr>
                        })
                    }
                </tbody>
            </table> */}
            <div></div>
            <table>
                <thead><tr><th colSpan={3}>Received By</th></tr></thead>
                <tr className='packing-slip-signature-box'><td></td><td></td><td></td></tr>
                <tr><td>Signature</td><td>Name</td><td>Date</td></tr>

            </table>
        </div>
    );
};

export default ViewPackingSlip;