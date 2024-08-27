import {useState} from 'react'

const OrderSearch = () => {
    const [orderSearch, setOrderSearch] = useState('')
    const handleChange = (e) => {
        const currentValue = e.target.value
        setOrderSearch(currentValue)
        console.log(currentValue);
    }
    return (
        <div>
            <input type="text" defaultValue={orderSearch} onChange={handleChange}/>
            <a href={"/edit-order?order=" + orderSearch}><button>Search</button></a>
        </div>
    )
}

export default OrderSearch