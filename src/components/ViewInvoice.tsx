import { useEffect, useState } from 'react';
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, doc, getDoc } from 'firebase/firestore'
import totalCalculator from '../scripts/totalCalculator.js'

const ViewInvoice = () => {
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
            <h1>Invoice {urlParams.get('order')}</h1>
            <table id='order-pricing-table'>
                <tr><td>Shipping</td><td>${totalCalculator(order.total, order.data.orderTaxRate, order.data.orderShippingCost, order.data.orderMarkup, order.data.orderDiscount).clientShipping.toFixed(2)}</td></tr>
                <tr><td>Subtotal</td><td>${totalCalculator(order.total, order.data.orderTaxRate, order.data.orderShippingCost, order.data.orderMarkup, order.data.orderDiscount).clientTotal.toFixed(2)}</td></tr>
                <tr><td>Tax</td><td>${totalCalculator(order.total, order.data.orderTaxRate, order.data.orderShippingCost, order.data.orderMarkup, order.data.orderDiscount).clientTax.toFixed(2)}</td></tr>
                <tr><td>Total before Discount</td><td>${totalCalculator(order.total, order.data.orderTaxRate, order.data.orderShippingCost, order.data.orderMarkup, order.data.orderDiscount).clientTotalWithTaxAndShipping.toFixed(2)}</td></tr>
                <tr><td>Total</td><td>${totalCalculator(order.total, order.data.orderTaxRate, order.data.orderShippingCost, order.data.orderMarkup, order.data.orderDiscount).clientTotalWithDiscount.toFixed(2)}</td></tr>
            </table>
            <table>
                <tr><th colSpan={2}>Order Info</th></tr>
                <tr><td>Reference 1</td><td>{order.data.ref1}</td></tr>
                <tr><td>Reference 2</td><td>{order.data.ref2}</td></tr>
                <tr><td>Client</td><td>{order.data.client}</td></tr>
                <tr><td>Description</td><td>{order.data.desc}</td></tr>
                <tr><td>Due date:</td><td>{order.data.dueDate}</td></tr>
            </table>
            <table>
                <tr>
                    <th>Billing</th><th>Shipping</th>
                </tr>
                <tr>
                    <td>
                    {order.data.billingCompany}<br/>
                    {order.data.billingAttn}<br/>
                    {order.data.billingAddress1}<br/>
                    {order.data.billingAddress2}<br/>
                    {order.data.billingAddress3}<br/>
                    {order.data.billingCity}<br/>
                    {order.data.billingState}<br/>
                    {order.data.billingZip}<br/>
                    {order.data.billingCountry}<br/>
                    </td>
                    <td>
                    {order.data.shippingCompany}<br/>
                    {order.data.shippingAttn}<br/>
                    {order.data.shippingAddress1}<br/>
                    {order.data.shippingAddress2}<br/>
                    {order.data.shippingAddress3}<br/>
                    {order.data.shippingCity}<br/>
                    {order.data.shippingState}<br/>
                    {order.data.shippingZip}<br/>
                    {order.data.shippingCountry}<br/>
                    </td>
                </tr>
            </table>
            <table>
                <thead>
                    <tr><th>#</th><th>Product</th><th>Substrate</th><th>Laminate</th><th>Press</th><th>Quantity</th><th>Price</th><th>Thumb</th></tr>
                </thead>
                <tbody>
                    {
                        order.items.map((item, index) => {
                            return <tr>
                                <td>{index + 1}</td>
                                <td>{item.itemProduct}</td>
                                <td>{item.itemSubstrate}</td>
                                <td>{item.itemLaminate}</td>
                                <td>{item.itemPress}</td>
                                <td>{item.itemQuantity}</td>
                                <td>$ {(item.itemCost * ((parseFloat(order.data.orderMarkup?order.data.orderMarkup:0)/100) + 1 )).toFixed(2)}</td>
                                <td><img src={item.itemThumbnail} alt="no-image" /></td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            <table>
                <thead><tr><th colSpan={3}>Recieved By</th></tr></thead>
                <tr className='packing-slip-signature-box'><td></td><td></td><td></td></tr>
                <tr><td>Signature</td><td>Name</td><td>Date</td></tr>
                
            </table>
        </div>
    );
};

export default ViewInvoice;