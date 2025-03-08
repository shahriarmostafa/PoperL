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
            durationDays: Number(data.duration),
            price: Number(data.price),
            dailyMinutesLimit: Number(data.dailyMinutesLimit)
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
                    <input {...register("dailyMinutesLimit")} name="dailyMinutesLimit" type="number" placeholder="Call Limit (minutes)"/>
                    <input {...register("price")} name="price" type="number" placeholder="Enter the price"/>
                    <input type="submit" className="show-all"/>
                </form>
            </div>
        </div>

    )
}