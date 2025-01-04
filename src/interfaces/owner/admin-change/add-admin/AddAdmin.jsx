import Sidebar from '../../shared/Sidebar/Bar';
import Nav from '../../shared/navbar/Nav';

import '../../admin.css';
export default function AddAdmin(){
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const userName = form.name.value;
        const password = form.password.value;
        const admin = {userName, password};
        fetch("https://backend-eta-blue-92.vercel.app/user", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(admin)
        })
        .then(res => res.json())
        .then(data => { 
            alert(data)
        })
    }
    return (
        <section className="admin owner">
            <div className="display d-flex">
                <Sidebar></Sidebar>
                <div className="view">
                    <Nav></Nav>
                    <div className="analytics">
                    <div className="form add-admin">
                        <h3 className="headline">Add Admin</h3>
                        <form onSubmit={handleSubmit}>
                            <input name="name" type="text" placeholder="Enter Username"/>
                            <input name="password" type="text" placeholder="Enter password"/>
                            <input type="submit" className="show-all"/>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </section>

    )
}