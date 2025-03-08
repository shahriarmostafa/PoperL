import { FaEdit, FaEye } from 'react-icons/fa';
import '../../styles/private/private.css';
import { MdDelete } from 'react-icons/md';
import { useForm} from 'react-hook-form';
import { useContext } from 'react';
import {AuthContext} from "../../providers/AuthProvider";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useComplains from '../../Hooks/useComplains';
import Swal from 'sweetalert2';

export default function Complain(){

    const {user} = useContext(AuthContext);


    const { register, handleSubmit, reset } = useForm();

    const [isLoading, complains, refetch] = useComplains(user?.uid);

    const axiosSecure = useAxiosSecure()

    const onSubmit = async (data) => {
        try {
            await axiosSecure.post("/complain", {
                uid: user.uid,
                name: user.displayName,
                title: data.subject,
                description: data.complain,
                whatsapp: data.phone
            });
    
            // Show success message
            Swal.fire({
                title: "Success!",
                text: "Your complaint was submitted successfully!"
            });
    
            // Reset the form fields
            reset();
    
            // Refetch if necessary
            refetch();
        } catch (error) {
            // Handle any errors here
            console.error(error);
        }
    };
    

    return (
        <section className="complain">
            <div className="container">
                <form onSubmit={handleSubmit(onSubmit)} action="" className="complain-form">
                <h2>Enter your complain here</h2>
                    <input {...register("subject")} name="subject" placeholder="Enter a subject for your complain" type="text" />
                    <input {...register("phone")} name="phone" placeholder="Enter you whatsapp number for contact (optional)" type="number" />
                    <textarea {...register("complain")} rows={6} required name="complain" id=""placeholder="Describe your complain here"></textarea>
                    <input type="submit" value="Submit" />
                </form>
                <div className="view-complains">
                    <h3 className='text-center'>Your Complains</h3>
                    <div className="complains-so-far">
                        <ul>

                            {
                                complains.map((item, index) => {
                                    return (
                                        <li key={index} className='d-flex justify-content-between'>
                                            <div className="info">
                                                <h5 className="subject">{item.title}</h5>
                                                <p className="paragraph">{item.description}</p>
                                            </div>
                                            <div className="actions d-flex">
                                                <button className="edit"><FaEdit></FaEdit></button>
                                                <button className="delete"><MdDelete></MdDelete></button>
                                                <button className='view'><FaEye></FaEye></button>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        
    )
}