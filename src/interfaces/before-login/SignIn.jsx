import auth from '../../firebase/firebase.init';
import { signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';
import { useRef, useState } from 'react';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import '../../styles/before-login/form.css'
import {Link} from 'react-router-dom';

export default function SignIn(){
    const [formErrorMessege, setFormErrorMessege] = useState('');
    const [formSuccessMessege, setFormSccessMessege] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // sign up using form
    const formSubmitHandler = (e) =>{
        e.preventDefault()
        const email = e.target.email.value;
        const password = e.target.password.value;
        setFormErrorMessege('')
        signInWithEmailAndPassword(auth, email, password).then(result => 
        setFormSccessMessege('Signed In : ' + result.user.email + '. ' + 'Name :' + result.user.displayName)
        ).catch(err => setFormErrorMessege(err.message)
        )
    }
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
            alert('Email field is empty');
            return;
        }
        else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(currentEmail)){
            alert("Email is not valid");
            return;
        }
        sendPasswordResetEmail(auth, currentEmail).then().catch(err => setFormErrorMessege(err.message))
    }
    return (
        <div className="sign-in page">
            <div className="form">
                <h1 className="headline">Sign In</h1>
                <form onSubmit={formSubmitHandler}>
                <input ref={emailRef} name="email" type="email" placeholder='Enter your email' required />
                <div className="password-box d-flex justify-content-between">                            
                    <div className="write-password">
                        <input name="password" type={showPassword? 'text' : 'password'} placeholder='Enter Your Password'  >
                        </input>
                        <button className="show-pass-btn" onClick={() => setShowPassword(!showPassword)}>{changeIcon()}</button>
                    </div>
                    
                    </div>
                    <input type="submit" />
                </form>
                <div className="errorMessage">
                {formErrorMessege? <i className="errorMessage"> {formErrorMessege} </i> : <i className="successMessage"> {formSuccessMessege} </i> }
                </div>
                <a href='#' onClick={forgotPassHandle}>Forgot Password?</a>
                <p onClick={forgotPassHandle} href='#'>Don't have an account? <span><Link to="./signup">Sign Up</Link></span></p>
            </div>
            <div className="directions">
            </div>
        </div>  
    )
}