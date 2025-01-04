import Sidebar from '../shared/Sidebar/Bar';
import Nav from '../shared/navbar/Nav';
import '../admin.css';
import { useNavigate } from 'react-router-dom';
export default function AddPackage(){
    const navigate = useNavigate()
    const submitHandler = (e) =>{
        e.preventDefault();
        const form = e.target;
        const packageName = form.packageName.value;
        const duration = form.duration.value;
        const price = form.price.value;
        fetch("https://backend-eta-blue-92.vercel.app/pack", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({packageName, duration, price})
        })
        .then(res => res.json())
        .then(data => {
            navigate('/packages')
        }
        )
        
    }
    return (
        <section className="admin owner">
            <div className="display d-flex">
                <Sidebar></Sidebar>
                <div className="view">
                    <Nav></Nav>
                    <div className="analytics">
                    <div className="form ">
                        <h3 className="headline">Add Package</h3>
                        <form onSubmit={submitHandler}>
                            <input name="packageName" type="text" placeholder="Enter Package Name"/>
                            {/* <select name="duration"id="">
                                <option selected value="Select duration for packages">Select duration for packages</option>
                                <option value="1">1 Hour</option>
                                <option value="2">2 Hours</option>
                                <option value="24">One Day</option>
                                <option value="48">Two Days</option>
                                <option value="168">One Week</option>
                                <option value="360">15 Days</option>
                                <option value="720">One Month</option>
                            </select> */}
                            <input name="duration" type="number" placeholder="Enter duration(Hour)"/>
                            <input name="price" type="number" placeholder="Enter the price"/>
                            <input type="submit" className="show-all"/>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </section>

    )
}