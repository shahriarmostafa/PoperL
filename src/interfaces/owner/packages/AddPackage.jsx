import '../admin.css';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
export default function AddPackage(){

    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, reset } = useForm();
    const { register: registerCp, handleSubmit: handleCpSubmit, reset: resetCp } = useForm();

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

    const onCreditPriceSubmit = async (data) => {
        await axiosSecure.post('/credit-price', {
            category: data.cpCategory,
            type: data.cpType,
            pricePerCredit: Number(data.pricePerCredit)
        });
        resetCp();
        Swal.fire({ icon: 'success', title: 'Saved!', text: 'Credit price updated.', timer: 1500, showConfirmButton: false });
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
                        <option value="english_medium">English Medium</option>
                        <option value="bangla_medium">Bangla Medium</option>
                     </select>
                    <input {...register("price")} name="price" type="number" placeholder="Enter the price"/>
                    <input type="submit" className="show-all"/>
                </form>
            </div>

            <div className="form mt-5">
                <h3 className="headline">Set Credit Pack Price</h3>
                <p style={{fontSize: '12px', marginBottom: '10px', color: '#34495E'}}>
                    Set the price per credit for unlimited credit packs, per category and medium.
                </p>
                <form onSubmit={handleCpSubmit(onCreditPriceSubmit)}>
                    <select {...registerCp("cpCategory", { required: true })}>
                        <option value="">-- Select a category --</option>
                        <option value="school">School</option>
                        <option value="college">College</option>
                        <option value="university">University</option>
                    </select>
                    <select {...registerCp("cpType", { required: true })}>
                        <option value="">-- Select a type --</option>
                        <option value="english_medium">English Medium</option>
                        <option value="bangla_medium">Bangla Medium</option>
                    </select>
                    <input {...registerCp("pricePerCredit", { required: true, min: 0.01 })} type="number" step="0.01" placeholder="Price per credit (BDT)"/>
                    <input type="submit" className="show-all" value="Save Credit Price"/>
                </form>
            </div>
        </div>

    )
}