import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import '../../styles/before-login/form.css';
import { AuthContext } from '../../providers/AuthProvider';
import { useForm } from "react-hook-form";
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { requestForToken } from '../../firebase/firebase.init';

export default function SignUp(){

    const { register, handleSubmit } = useForm();
    const {createUser, editProfile} = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const axiosSecure = useAxiosSecure()

    const navigate = useNavigate();


    //handling sign up form submit

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
      
        if (!data.checkbox) {
          alert("Please confirm the checkbox");
          return;
        }
      
        const extraData = {
          displayName: data.name,
        };
      
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 3000, // Initial timer duration
          timerProgressBar: true,
        });
      
        const timerInstance = Toast.fire({
          icon: "info",
          title: "Processing your request...",
        });
      
        try {
          // Stop the timer while `createUser` is in progress
          const res = await createUser(data.email, data.password);
      
          // Resume and stop the timer for `editProfile`
          Swal.resumeTimer();
          await editProfile(res.user, extraData);
      
          // Resume and stop the timer for the Axios request

          const userInDataBase = {
            uid: res.user?.uid,
            email: res.user?.email,
            displayName: res.user?.displayName,
            photoURL: res.user?.providerData[0]?.photoURL,
            FCMToken: await requestForToken() || null,
            activePackage: null
          };
      
          await axiosSecure.post("/newStudent", userInDataBase);
      
          // Navigate to chat and complete the flow
          Swal.resumeTimer();
          navigate("/chat");
      
          Swal.update({
            icon: "success",
            title: "Signed in successfully!",
          });
        } catch (error) {
          console.error(error);
      
          Swal.update({
            icon: "error",
            title: "An error occurred",
            text: error.message,
          });
      
          Swal.stopTimer();
        }
      };

    //change icon for form
    const changeIcon = () => {
        if(showPassword == true){
            return <FaEye />;
        }
        else{
            return <FaEyeSlash/>;
        }
    }
    return (
        <div className="sign-up page">
            <div className="form container">
                <h1 className="headline">Sign Up</h1>
                {/* the form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("name", {required: true, maxLength: 30})} type='text' placeholder='Enter Your Full Name' />
                    <input {...register("email", {required: true})} type="email" placeholder='Enter your email' required />
                    <div className="password-box">                            
                        <div className="write-password">
                            <input {...register("password", {minLength: 8})} type={showPassword? 'text' : 'password'} placeholder='Enter Your Password'  >
                            </input>
                            <button className="show-pass-btn" onClick={() => setShowPassword(!showPassword)}>{changeIcon()}</button>
                        </div>
                        <div className="confirm-password">
                            <input {...register("confirmPassword")} type={showPassword? 'text' : 'password'} placeholder='Confirm Password' ></input>
                            <button className="show-pass-btn" onClick={() => setShowPassword(!showPassword)}>{changeIcon()}</button>
                        </div>
                    </div>
                    <input {...register("checkbox")} type="checkbox" /> <span>Accept Tearms and Conditions</span>
                    <input type="submit" />
                </form>
                <p>Apply as a teacher? <span><Link to="/teacherSignUp">Sign Up</Link></span></p>
            </div>
        </div>  
    )
}