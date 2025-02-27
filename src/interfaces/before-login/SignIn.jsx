import auth, { requestForToken } from '../../firebase/firebase.init';
import { sendPasswordResetEmail} from 'firebase/auth';
import { useContext, useRef, useState } from 'react';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import '../../styles/before-login/form.css'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

export default function SignIn(){
    const [showPassword, setShowPassword] = useState(false);

    const {userSignIn}= useContext(AuthContext);



    const location = useLocation()
    const navigate = useNavigate();

        const axiosSecure = useAxiosSecure();
    

    



    //setting the nottification

    const setTokenToDataBase = async(uid) => {
        const token = await requestForToken();
        if (!token) return;
        axiosSecure.post("/setTokenToProfile", {token, uid});
    }



    
    

    // sign up using form
    const formSubmitHandler = (e) => {
        e.preventDefault();
      
        const email = e.target.email.value;
        const password = e.target.password.value;
      
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      
        const timerInstance = Toast.fire({
          icon: "info",
          title: "Signing you in...",
        });
      
        // Stop the timer while the signing-in process is ongoing
        Swal.stopTimer();
      
        userSignIn(email, password)
          .then((result) => {
            // Reset the form
            e.target.reset();
            
            setTokenToDataBase(result.user.uid);

      
            // Navigate to the intended page or fallback to the default route
            navigate(location?.state || "/user/teachers");
      
            // Resume the timer and display success
            Swal.resumeTimer();
            Swal.update({
              icon: "success",
              title: "Signed in successfully!",
            });


            
          })
          .catch((err) => {
            // Handle errors and stop the timer
      
            Swal.stopTimer();
            Swal.update({
              icon: "error",
              title: "An error occurred",
              text: err.message,
            });
          });

      };
      
    function changeIcon(){
        if(showPassword == true){
            return <FaEye />;
        }
        else{
            return <FaEyeSlash/>;
        }
    }
    const emailRef = useRef(null);
    function forgotPassHandle(){
        const currentEmail = emailRef.current.value;
        if(!currentEmail){
            Swal.fire({
                title: "In a hurry!",
                text: "Enter a email before trying to change password",
                icon: "success"
            })
            return;
        }
        else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(currentEmail)){
            Swal.fire({
                title: "In a hurry!",
                text: "Enter a proper email first",
                icon: "success"
            })
            return;
        }
        sendPasswordResetEmail(auth, currentEmail).then().catch(err => err)
    }
    return (
        <div className="sign-in page">
            <div className="container">
            <div className="form">
                <h1 className="headline">Sign In</h1>
                <form onSubmit={formSubmitHandler}>
                <input ref={emailRef} name="email" type="email" placeholder='Enter your email' required />
                <div className="password-box">                            
                    <div className="write-password">
                        <input name="password" type={showPassword? 'text' : 'password'} placeholder='Enter Your Password'  >
                        </input>
                        <button className="show-pass-btn" onClick={() => setShowPassword(!showPassword)}>{changeIcon()}</button>
                    </div>
                
                    </div>
                    <input type="submit" />
                </form>

                <a href='#' onClick={forgotPassHandle}>Forgot Password?</a>
                <p href='#'>Don't have an account? <span><Link to="/signup">Sign Up</Link></span></p>
            </div>
            </div>
            <div className="directions">
            </div>
        </div>  
    )
}