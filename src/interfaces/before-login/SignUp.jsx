import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import '../../styles/before-login/form.css';
import { AuthContext } from '../../providers/AuthProvider';
import { useForm } from "react-hook-form";
import useAxiosSecure from '../../Hooks/useAxiosSecure';

export default function SignUp(){

    const { register, handleSubmit } = useForm();
    const {createUser, editProfile} = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const axiosSecure = useAxiosSecure()

    const navigate = useNavigate();

    //handling sign up form submit

    const onSubmit = (data) => {
        
        if(data.password != data.confirmPassword){
            alert("Password didn't match");
            return;
        }
        else if(data.checkbox == false){
            alert("please confirm checkbox")
            return;
        }
            const extraData = {
                displayName: data.name            
            }
            createUser(data.email, data.password).then(res => {
                editProfile(res.user, extraData).then(data => {
                    const userInDataBase = {
                        uid: res.user?.uid,
                        email: res.user?.email,
                        displayName: res.user?.displayName,
                        photoURL: res.user?.providerData[0].photoURL
                    }
                    axiosSecure.post('/newStudent', userInDataBase)
                    .then(res => {
                        console.log(res);
                        navigate("/chat")
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            })
    }

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
                <p>Already have an account? <span><Link to="./signup">Sign Up</Link></span></p>
            </div>
        </div>  
    )
}