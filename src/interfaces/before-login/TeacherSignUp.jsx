import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import '../../styles/before-login/form.css';
import { AuthContext } from '../../providers/AuthProvider';
import { useForm } from "react-hook-form";
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { requestForToken } from '../../firebase/firebase.init';
import SocialSignUp from './shared/SocialSignUp';



export default function TeacherSignUp(){

    const { register, handleSubmit } = useForm();
    const {createUser, editProfile, signInWithGoogle} = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const axiosSecure = useAxiosSecure()

    const navigate = useNavigate();

    //handling sign up form submit

    const teacherOnSubmit = async (data) => {
        // Validate inputs
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
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      
        const timerInstance = Toast.fire({
          icon: "info",
          title: "Processing your request...",
        });
      
        try {
          // Step 1: Create user
          Swal.stopTimer();
          const res = await createUser(data.email, data.password);
      
          // Step 2: Update user profile
          Swal.resumeTimer();
          Swal.stopTimer();
          await editProfile(res.user, extraData);

          console.log(res);
          
      
          // Step 3: Prepare user data for the database
          const userInDataBase = {
            uid: res.user?.uid,
            email: res.user?.email,
            displayName: res.user?.displayName,
            photoURL: res.user?.providerData[0]?.photoURL,
            whatsapp: data.phone, // Collect WhatsApp number
            experience: 0,
            rating: 4,
            joined: Date.now(),
            subjects: [],
            category: data.category,
            points: 0,
            revenuePercent: 0.75,
            joinedGroup: null,
            ownerOfGroup: null,
            groupMembers: 0,
            approved: false, // Default approval status
            FCMToken: await requestForToken(),
            isOnline: false
          };
      
          // Step 4: Add user data to the database
          Swal.resumeTimer();
          Swal.stopTimer();
          await axiosSecure.post("/newTeacher", userInDataBase);
      
          // Step 5: Navigate to chat after successful completion
          Swal.resumeTimer();
          navigate("/user/chat");
      
          Swal.update({
            icon: "success",
            title: "Teacher account created successfully!",
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


      const googleSignIn = () => {
          Swal.fire({
            title: 'Whatsapp number and category',
            html:
              '<input id="swal-input1" type="number" class="swal2-input" placeholder="WhatsApp Number">' +
              '<select id="swal-input2" class="swal2-select">' +
                '<option value="school/college">School/College</option>' +
                '<option value="university">University</option>' +
              '</select>',
            showCancelButton: true,
            showConfirmButton: true,
            focusConfirm: false,
            allowOutsideClick: false,
            preConfirm: () => {
              const whatsappNumber = document.getElementById('swal-input1').value;
              const selectedOption = document.getElementById('swal-input2').value;
      
              if (!whatsappNumber) {
                Swal.showValidationMessage('Please enter your WhatsApp number');
                return false;
              }
      
              return { whatsappNumber, selectedOption };
            },
          }).then(async (result) => {
            if (result.isConfirmed) {
              try{
                const { whatsappNumber, selectedOption } = result.value;

              const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
            
              const timerInstance = Toast.fire({
                icon: "info",
                title: "Processing your request...",
              });

              Swal.stopTimer();

              
            const response = await signInWithGoogle()
            
            const userInDataBase = {
              uid: response.user?.uid,
              email: response.user?.email,
              displayName: response.user?.displayName,
              photoURL: response.user?.providerData[0]?.photoURL,
              whatsapp: whatsappNumber, // Collect WhatsApp number
              experience: 0,
              rating: 4,
              joined: Date.now(),
              subjects: [],
              category: selectedOption,
              points: 0,
              revenuePercent: 0.75,
              joinedGroup: null,
              ownerOfGroup: null,
              groupMembers: 0,
              approved: false, // Default approval status
              FCMToken: await requestForToken(),
              isOnline: false
            };
            Swal.resumeTimer();
          Swal.stopTimer();
            
            await axiosSecure.post("/newTeacher", userInDataBase);
            Swal.resumeTimer();
      
            navigate("/user/chat");
              }catch (err){
                Swal.update({
                  icon: "error",
                  title: "An error occurred",
                  text: err.message,
                });
                console.log(err);
            } 
              
            }
          });
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
        <div className="sign-up auth-page">
            <div className="form container">
                <h1 className="headline">Sign Up as a teacher</h1>
                {/* the form */}
                <form onSubmit={handleSubmit(teacherOnSubmit)}>
                    <input {...register("name", {required: true, maxLength: 30})} type='text' placeholder='Your Full Name' />
                    <input {...register("email", {required: true})} type="email" placeholder='Enter your email' required />
                    <input {...register("phone", {required: true})} type="number" placeholder='Whatsapp number' required />
                    <select {...register("category")} name="" id="">
                      <option value="school/college">School/College</option>
                      <option value="university">University</option>
                    </select>
                    <div className="password-box">                            
                        <div className="write-password">
                            <input {...register("password", {minLength: 8})} type={showPassword? 'text' : 'password'} placeholder='Your Password'  >
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
                <p>Student Sign up? <span><Link to="/signup">Sign Up</Link></span></p>
                <SocialSignUp googleSignIn={googleSignIn}></SocialSignUp>
            </div>
        </div>  
    )
}