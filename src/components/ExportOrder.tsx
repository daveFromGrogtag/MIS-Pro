import { useState, useEffect } from 'react'
import { db, setDoc, doc } from '../scripts/firebase/init.ts'
import { query, collection, getDocs, where, orderBy, limit } from "firebase/firestore"
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
        console.log(items);
        
        let sumTotal = 0
        items.map(item => {
            sumTotal += parseFloat(item.itemCost)
        });
        setTotal(sumTotal)
    } 

    return (
        <div>
            <OrderInfo data={data} setData={setData}/>
            <h2>Total: ${total.toFixed(2)}</h2>
            <ItemList items={items} setItems={setItems}/>
            <button onClick={createNewOrder}>Creat Order</button>
        </div>
    )
}

export default ExportOrder