import '../styles/before-login/form.css'
import {Link} from 'react-router-dom';

export default function BeforeLoginForm({formSubmitHandler, setShowPassword, showPassword, formErrorMessege, formSuccessMessege, formTitle, whattodo, tolink}){
    
    return (
        <div className="form">
            <h1 className="headline">{formTitle}</h1>
            <form onSubmit={formSubmitHandler}>
            <input name="name" type="text" placeholder='Enter Your Full Name' />
            <input name="email" type="email" placeholder='Enter your email' required />
            <div className="password-box d-flex justify-content-between">                            
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
            <p>Don't have an account? <span><Link to={tolink}>{whattodo}</Link></span></p>

        </div>
        
    );
}