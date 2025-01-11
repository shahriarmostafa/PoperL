import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";


export default function Home(){

    const {user, logOut} = useContext(AuthContext);



    const [installPrompt, setInstallPrompt] = useState(null);
    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
        event.preventDefault();
        setInstallPrompt(event);
        console.log('beforeinstallprompt event captured');
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  
  // check install option
  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt(); // Show the install prompt
      const choiceResult = await installPrompt.userChoice;      
      setInstallPrompt(null);
    }
  };





    const handleLogOut = () => {
        logOut().then(success => {
            console.log(success);
            
        }).catch(err => {
            console.log(err);
        })
    }

    



      if (window.matchMedia('(display-mode: standalone)').matches) {
        return (
          <div className="home">
            <Link to="/maintainance/admins">Admin</Link>
            <Link to="/complain">Complain</Link>
  
              <div className="user">
                  {user?.displayName}
              </div>
              <button onClick={handleLogOut}>Sign Out</button>
              <hr />
              <Link to="/subscription"><button>Ghuira dekho?</button></Link>
              <Link to="/chat"><button className="btn btn-success">Chat</button></Link>
              <Link to="/TeacherList"><button className="btn btn-success mx-3">Teacher List</button></Link>
              <Link to="/TeacherSignUp"><button className="btn btn-success mx-3">Teacher Sign Up</button></Link>
          </div>
      );
      } 
      else {
        if(installPrompt){
          Swal.fire({
            title: "Download PoperL",
            showCancelButton: true,
            confirmButtonText: "Download",
            position: "top"
          }).then((result) => {
            if (result.isConfirmed) {
              handleInstallClick()
            }
          })
        }
      }
}