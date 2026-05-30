import '../admin.css';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useForm } from 'react-hook-form';
export default function EditPack(){


    const navigate = useNavigate();

    const { register, handleSubmit } = useForm();
    

    const {id, name, price, packageLimit, credit, type} = useParams();

    const axiosSecure = useAxiosSecure();


    const onSubmit = async (data) => {

        const details = {name: data.packageName, price: Number(data.price), credit: Number(data.credit), type: data.type};

        await axiosSecure.put(`/pack/${id}`, details)
        navigate('/maintainance/packages')

    }

    return (
        <div className="analytics">
            <div className="form">
                <h3 className="headline">Edit {name} Pack</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("packageName")} defaultValue={name} name="packageName" type="text" placeholder="Enter the new name"/>
                    <input {...register("credit")} defaultValue={credit} name="credit" type="number" placeholder="Enter the credit number"/>
                    <input {...register("price")} defaultValue={price} name="price" type="number" placeholder="Enter the new price"/>
                    <select {...register("type", { required: "Please select a type" })} defaultValue={type}>
                        <option value="">-- Select a type --</option>
                        <option value="english_medium">English Medium</option>
                        <option value="bangla_medium">Bangla Medium</option>
                    </select>
                    <input type="submit" className="show-all"/>
                </form>
            </div>
        </div>
    )
}