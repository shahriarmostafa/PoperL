import Sidebar from '../shared/Sidebar/Bar';
import Nav from '../shared/navbar/Nav';

import '../admin.css';
export default function EditPack(){
    
    return (
        <section className="admin owner">
            <div className="display d-flex">
                <Sidebar></Sidebar>
                <div className="view">
                    <Nav></Nav>
                    <div className="analytics">
                    <div className="form">
                        <h3 className="headline">Edit Package</h3>
                        <form>
                            <select name="duration"id="">
                                <option selected value="Select duration for packages">Select your package name</option>
                                <option value="1">1 Hour</option>
                                <option value="2">2 Hours</option>
                                <option value="24">One Day</option>
                                <option value="48">Two Days</option>
                                <option value="168">One Week</option>
                                <option value="360">15 Days</option>
                                <option value="720">One Month</option>
                            </select>
                            <input name="price" type="number" placeholder="Enter the new price"/>
                            <input type="submit" className="show-all"/>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </section>

    )
}