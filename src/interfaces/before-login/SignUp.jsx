import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from 'firebase/auth';
import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import '../../styles/before-login/form.css';
import { AuthContext } from '../../providers/AuthProvider';
export default function SignUp(){
    const [formErrorMessege, setFormErrorMessege] = useState('');
    const [formSuccessMessege, setFormSccessMessege] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {createUser} = useContext(AuthContext);

    const navigate = useNavigate();

    // sign up using form
    const formSubmitHandler = (e) =>{
        e.preventDefault()
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const checkbox = e.target.checkbox.checked;
        if(password.length < 8){
            setFormErrorMessege("Password should contain atleast 8 charecters");
            return;
        }
        else if(password != confirmPassword){
            setFormErrorMessege('Password Not Matching');
            return;
        }
        else if (!checkbox){
            setFormErrorMessege('please accept temrs and conditions to continue');
            return;
        }
        setFormErrorMessege('');
        createUser(email, password).then(result => {
            setFormSccessMessege('User Created : ' + result.user.email);
            sendEmailVerification(result.user).then(() => {
                alert("Check email to confirm your account");
                e.target.reset();
                navigate('/subscription');
            }
            ).catch(err => {
            setFormErrorMessege(err.message)
        })
        updateProfile(result.user, {
            displayName: name,
            photoURL: ''
        }).then(
            setFormSccessMessege(formSuccessMessege + 'User name added')
        ).catch(err => setFormErrorMessege(err.message));
        }
        ).catch(err => setFormErrorMessege(err.message)
        )
        // createUserWithEmailAndPassword(auth, email, password).then(result => {
        //     setFormSccessMessege('User Created : ' + result.user.email);
        //     sendEmailVerification(result.user).then(alert("Check email to confirm your account")).catch(err => {
        //     setFormErrorMessege(err.message)
        // })
        // updateProfile(result.user, {
        //     displayName: name,
        //     photoURL: ''
        // }).then(
        //     setFormSccessMessege(formSuccessMessege + 'User name added')
        // ).catch(err => setFormErrorMessege(err.message));
        // }
        // ).catch(err => setFormErrorMessege(err.message)
        // )
    }
    function changeIcon(){
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
                <form onSubmit={formSubmitHandler}>
                <input name="name" type="text" placeholder='Enter Your Full Name' />
                <input name="email" type="email" placeholder='Enter your email' required />
                <div className="password-box">                            
                    <div className="write-password">
                        <input name="password" type={showPassword? 'text' : 'password'} placeholder='Enter Your Password'  >
                        </input>
                        <button className="show-pass-btn" onClick={() => setShowPassword(!showPassword)}>{changeIcon()}</button>
                    </div>
                    <div className="confirm-password">
                        <input name="confirmPassword" type={showPassword? 'text' : 'password'} placeholder='Confirm Password' ></input>
                        <button className="show-pass-btn" onClick={() => setShowPassword(!showPassword)}>{changeIcon()}</button>
                    </div>
                    </div>
                    <input type="checkbox" name="checkbox" /> <span>Accept Tearms and Conditions</span>
                    <input type="submit" />
                </form>
                <div className="errorMessage">
                {formErrorMessege? <i className="errorMessage"> {formErrorMessege} </i> : <i className="successMessage"> {formSuccessMessege} </i> }
                </div>
                <p>Already have an account? <span><Link to="./signup">Sign Up</Link></span></p>
            </div>
        </div>  
    )
}