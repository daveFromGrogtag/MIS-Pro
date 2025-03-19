import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs } from 'firebase/firestore'
import AddNewAttribute from "./AddNewAttribute.tsx"
import Loading from "./Loading.tsx"

const MaterialCost = ({materialType}) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, materialType)));
                const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(docs);
                console.log(docs);

            } catch (error) {
                console.error("Error fetching documents: ", error);
            } finally {
                setLoading(false);
            }
        };
        console.log('fetching data...');
        fetchData();
    }, []);

    if (loading) {
        return <Loading/>;
    }

    return (
        <table>
        <thead>
            <tr>
                <th colSpan={4} style={{textAlign: "center", textTransform: "uppercase"}}>{materialType}</th>
            </tr>
            <tr>
                <th>Name</th><th>Cost per sq. in.</th><th>Time per sq. in. (Seconds)</th><th>Action</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item) => (
                <tr key={item.id}><td>{item.name}</td><td>{item.costPerSquareInch}</td><td>{item.timePerSquareInch}</td><td><button><a href={`/edit-attribute?category=${materialType}&attributeId=${item.id}`}>Edit</a></button></td></tr>
            ))}
        </tbody>
        <tfoot>
            <tr><td colSpan={4}><AddNewAttribute category={materialType}/></td></tr>
        </tfoot>
        </table>
    );

}

export default MaterialCost