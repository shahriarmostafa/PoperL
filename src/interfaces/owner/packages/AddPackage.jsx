import '../admin.css';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useForm } from 'react-hook-form';
export default function AddPackage(){

    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, reset } = useForm();
    

    const onSubmit = async (data) =>{
        const item = {
            name: data.name,
            category: data.category,
            type: data.type,
            durationDays: Number(data.duration),
            price: Number(data.price),
            credit: Number(data.credit)
        }   
        await axiosSecure.post('/pack', item)
        navigate("/maintainance/packages")
    }
    return (
        <div className="analytics">
            <div className="form ">
                <h3 className="headline">Add Package</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("name")} name="name" type="text" placeholder="Enter Package Name"/>
                    <input {...register("duration")} name="duration" type="number" placeholder="Enter duration(Hour)"/>
                    <input {...register("credit")} name="credit" type="number" placeholder="Credits"/>
                    <select {...register("category", { required: "Please select a category" })}>
                        <option value="">-- Select a category --</option>
                        <option value="school">School</option>
                        <option value="college">College</option>
                        <option value="university">University</option>
                     </select>
                     <select {...register("type", { required: "Please select a type" })}>
                        <option value="">-- Select a type --</option>
                        <option value="general">General</option>
                        <option value="special">Special</option>
                     </select>
                    <input {...register("price")} name="price" type="number" placeholder="Enter the price"/>
                    <input type="submit" className="show-all"/>
                </form>
            </div>
        </div>

    )
}