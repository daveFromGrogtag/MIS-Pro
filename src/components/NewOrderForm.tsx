import { useState, useEffect } from 'react'

function NewOrderForm() {
    const [orderData, setOrderData] = useState({})
    const [items, setItems] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submitted');
    }

    const addItem = () => {
        setItems([])
    }



    return (
        <form onSubmit={handleSubmit}>
            <div>
                
            </div>
        </form>
    )
}