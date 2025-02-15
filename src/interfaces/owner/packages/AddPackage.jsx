import '../admin.css';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
export default function AddPackage(){
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();


    const submitHandler = (e) =>{
        e.preventDefault();
        const form = e.target;
        const item = {
            packageName: form.packageName.value,
            duration: form.duration.value,
            price: form.price.value
        }
        axiosSecure.post('/pack', item)
        .then(res => res.json())
        .then(data => {
            navigate('/packages')
        }
        )
        
    }
    return (
        <div className="analytics">
            <div className="form ">
                <h3 className="headline">Add Package</h3>
                <form onSubmit={submitHandler}>
                    <input name="packageName" type="text" placeholder="Enter Package Name"/>
                    <input name="duration" type="number" placeholder="Enter duration(Hour)"/>
                    <input name="price" type="number" placeholder="Enter the price"/>
                    <input type="submit" className="show-all"/>
                </form>
            </div>
        </div>

    )
}