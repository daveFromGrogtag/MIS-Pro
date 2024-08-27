import { useState, useEffect } from "react"
import { db } from '../scripts/firebase/init.ts'
import { query, collection, getDocs } from 'firebase/firestore'
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
                <th colSpan={3} style={{textAlign: "center", textTransform: "uppercase"}}>{materialType}</th>
            </tr>
            <tr>
                <th>Name</th><th>Cost per sq. in.</th><th>action</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item) => (
                <tr key={item.id}><td>{item.name}</td><td>{item.costPerSquareInch}</td><td><button>Edit</button><button>Delete</button></td></tr>
            ))}
        </tbody>
        <tfoot>
            <tr><td colSpan={3}><button>Add New {materialType} +</button></td></tr>
        </tfoot>
        </table>
    );

}

export default MaterialCost