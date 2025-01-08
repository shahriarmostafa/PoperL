import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Swal from "sweetalert2";


export default function Home(){



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

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt(); // Show the install prompt

      const choiceResult = await installPrompt.userChoice;
      console.log('User choice:', choiceResult.outcome);

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






    const {user, logOut} = useContext(AuthContext);
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
            {installPrompt && (
              Swal.fire({
                title: "Download PoperL",
                showCancelButton: true,
                confirmButtonText: "Download"
              }).then((result) => {
                if (result.isConfirmed) {
                  handleInstallClick()
                }
              })
          )}
        </div>
    );
}