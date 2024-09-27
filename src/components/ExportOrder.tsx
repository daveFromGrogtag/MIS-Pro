import { useState, useEffect } from 'react'
import { db, doc } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, where, orderBy, limit, setDoc } from "firebase/firestore"
import OrderInfo from './OrderInfo'
import ItemList from './ItemList'
import { generateOrderId } from '../scripts/firebase/generateOrderId.ts'




const ExportOrder = () => {
    const [data, setData] = useState({})
    const [items, setItems] = useState([])
    const [total, setTotal] = useState(0)
    const [status, setStatus] = useState('open')

    useEffect(() => {
        getOrderTotal()
    },[items, data])

    
    const exportToFirebase = (orderId, orderIdString) => {
        try {
            setDoc(doc(db, "orders", orderIdString), {
                orderId,
                data,
                items,
                total,
                status
            }).then(() => {
                alert('order saved')
                window.location.href = `/edit-order?order=${orderIdString}`
            })
        } catch (error) {
            console.error(error);
            
        }
    }
    
    const createNewOrder = () => {
        try {
            const lastOrderQuery = query(collection(db, 'orders'), orderBy('orderId', "desc"), limit(1))
            getDocs(lastOrderQuery)
            .then((docs) => {
                docs.forEach((doc) => {
                    let newOrderId = parseInt(doc.id) + 1
                    let newOrderIdString:string = `${parseInt(doc.id) + 1}`
                    console.log(newOrderId);
                    
                    exportToFirebase(newOrderId, newOrderIdString)
                })
            })
            
        } catch (error) {
            console.error(error);
        } 
    }
    
    const getOrderTotal = () => {
        let sumTotal = 0
        items.map(item => {
            sumTotal += parseFloat(item.itemCost)
        });
        setTotal(sumTotal)
    } 
    
    const totalCosts = (total, taxRate, shippingCost, markup, discount) => {
        total = parseFloat(total)
        taxRate = parseFloat(taxRate)/100
        shippingCost = parseFloat(shippingCost)
        markup = parseFloat(markup)/100
        discount = parseFloat(discount)/100

        let clientTotal = total * (1 + markup)
        let clientShipping =  shippingCost * (1 + markup)
        let clientTax = clientTotal * taxRate
        let clientSubtotalWithTax = clientTotal * (1 + taxRate)
        let clientTotalWithTaxAndShipping = clientSubtotalWithTax + clientShipping
        let clientTotalWithDiscount = clientTotalWithTaxAndShipping * (1 - discount)

        let clientTotals = {
            cost: total,
            shippingCost: shippingCost,
            clientTotal: clientTotal,
            clientShipping: clientShipping,
            clientTax: clientTax,
            clientSubtotalWithTax: clientSubtotalWithTax,
            clientTotalWithTaxAndShipping: clientTotalWithTaxAndShipping,
            clientTotalWithDiscount: clientTotalWithDiscount
        }
        return clientTotals
    }

    return (
        <div>
            <OrderInfo data={data} setData={setData}/>

            <table id='order-pricing-table'>
                <tr><td>Cost</td><td>${totalCosts(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).cost.toFixed(2)}</td></tr>
                <tr><td>Tax</td><td>${totalCosts(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientTax.toFixed(2)}</td></tr>
                <tr><td>Shipping</td><td>${totalCosts(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).shippingCost.toFixed(2)}</td></tr>
                <tr><td>Shipping MU</td><td>${totalCosts(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientShipping.toFixed(2)}</td></tr>
                <tr><td>Total MU</td><td>${totalCosts(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientTotalWithTaxAndShipping.toFixed(2)}</td></tr>
                <tr><td>Total + MU - D</td><td>${totalCosts(total, data.orderTaxRate, data.orderShippingCost, data.orderMarkup, data.orderDiscount).clientTotalWithDiscount.toFixed(2)}</td></tr>
            </table>
            <ItemList items={items} setItems={setItems}/>
            <button onClick={createNewOrder}>Create Order</button>
        </div>
    )
}

export default ExportOrder