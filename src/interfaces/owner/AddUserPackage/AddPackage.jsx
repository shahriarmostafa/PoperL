import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function AddUserPackage() {
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axiosSecure.post("/admin-add-subscription", {
                email: data.email,
                durationHours: Number(data.durationHours),
                credit: Number(data.credit),
                amountReceived: Number(data.amountReceived),
                category: data.category,
                type: data.type,
            });

            const { type } = res.data;
            const label = type === "admin-extension" ? "Extended" : "New Package Added";

            Swal.fire({
                icon: "success",
                title: label,
                text: `Successfully processed for ${data.email}`,
                confirmButtonColor: "#4E73DF",
            });

            reset();
        } catch (err) {
            const msg = err?.response?.data?.error || "Something went wrong";
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: msg,
                confirmButtonColor: "#4E73DF",
            });
        }
    };

    return (
        <div className="analytics">
            <div className="form">
                <h3 className="headline">Add User Package</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("email", { required: true })}
                        placeholder="User Email"
                        type="email"
                    />
                    <input
                        {...register("durationHours", { required: true })}
                        placeholder="Duration (Hours)"
                        type="number"
                        min="1"
                    />
                    <input
                        {...register("credit", { required: true })}
                        placeholder="Credits"
                        type="number"
                        min="0"
                    />
                    <input
                        {...register("amountReceived", { required: true })}
                        placeholder="Amount Received (৳)"
                        type="number"
                        min="0"
                    />
                    <select {...register("category", { required: true })}>
                        <option value="">-- Select a category --</option>
                        <option value="school">School</option>
                        <option value="college">College</option>
                        <option value="university">University</option>
                    </select>
                    <select {...register("type", { required: true })}>
                        <option value="">-- Select a type --</option>
                        <option value="bangla_medium">Bangla Medium</option>
                        <option value="english_medium">English Medium</option>
                    </select>
                    <input type="submit" value="Add Package" />
                </form>
            </div>
        </div>
    );
}
