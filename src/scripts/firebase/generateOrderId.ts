import {db} from "./init.js"
import { query, collection, getDocs, where, orderBy, limit } from "firebase/firestore"

function generateOrderId() {
    try {
        const lastOrderQuery = query(collection(db, 'orders'), orderBy('orderId', "desc"), limit(1))
        getDocs(lastOrderQuery)
        .then((docs) => {
            docs.forEach((doc) => {
                // console.log(doc.data().orderId + 1)
                return doc.data().orderId
            })
        })
        
    } catch (error) {
        console.error(error);
    }
}

export {generateOrderId}