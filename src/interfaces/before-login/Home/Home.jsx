import { useContext } from "react";
import {AuthContext} from "../../../providers/AuthProvider"
import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";


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
        return <Navigate to="/signup"></Navigate>
      } else{
        return (
          <div className="min-vh-100 bg-dark text-white d-flex flex-column align-items-center p-4">
      {/* Header */}
      <header className="w-100 d-flex justify-content-between align-items-center py-3 px-4 bg-danger shadow-sm">
        <h1 className="text-white">PoperL</h1>
        <button className="btn btn-light">Get Started</button>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-5">
        <h2 className="display-4 text-light">Learn Anytime, Anywhere</h2>
        <p className="lead text-secondary">Connect with expert teachers on-demand.</p>
        <button onClick={handleInstallClick} className="btn btn-danger btn-lg mt-3">Start Learning</button>
      </section>

      {/* Features */}
      <div className="container mt-5">
        <div className="row">
          {["Instant Tutoring", "Flexible Packages", "Interactive Whiteboard"].map((feature, index) => (
            <div key={index} className="col-md-4 text-center">
              <div className="border border-danger p-4 bg-secondary text-white rounded">
                <h3>{feature}</h3>
                <p>Seamless experience for students and teachers.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-5 py-3 bg-danger text-center w-100">
        <p className="text-white">&copy; 2025 PoperL. All rights reserved.</p>
      </footer>
    </div>
        )
        
      }
        // if(installPrompt){
        //   Swal.fire({
        //     title: "Download PoperL",
        //     showCancelButton: true,
        //     confirmButtonText: "Download",
        //     position: "top"
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       handleInstallClick()
        //     }
        //   })

        //   return(
        //     <button className="btn btn-danger" onClick={handleInstallClick}>Download</button>
        //   )
        // }

}

