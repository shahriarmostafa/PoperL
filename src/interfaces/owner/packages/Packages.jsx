import Sidebar from '../shared/Sidebar/Bar';
import Nav from '../shared/navbar/Nav';
import {Link, useLoaderData} from 'react-router-dom';
import Pack from './Pack';
import '../admin.css';
import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
export default function Packages(){
    const Packages = useLoaderData();
    const [loadedPackages, setLoadedPackages] = useState(Packages);

    const axiosSecure = useAxiosSecure();

    const handleDelete = (id) => {
        axiosSecure.delete(`/pack/${id}`)
        .then(res => res.json())
        .then(data => {
            if(data.deletedCount == 1){
                const filteredData = loadedPackages.filter(x => x._id != id);
                // use tanstack query and refetch here instead of filter and state
                setLoadedPackages(filteredData);
            } 
        })
               
    }
    return (
        <section className="admin owner">
            <div className="display d-flex">
                <Sidebar></Sidebar>
                <div className="view">
                    <Nav></Nav>
                    <div className="analytics">
                        <div className="redi-buttons mb-4 d-flex">
                            <Link to="/add-package">
                                <button className="show-all">Add New Package</button>
                            </Link>
                        </div>
                        <div className="packages">
                            {loadedPackages.map(x => {
                                return <Pack id={x._id} deletePack={handleDelete} key={x._id} packName={x.packageName} price={x.price} packageLimit={x.duration}></Pack>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}