import { FaFacebookF } from "react-icons/fa"

export default function SocialSignUp ({googleSignIn}) {
    return (
        <div className="container">
            <h3 className="title text-center">Or <br />Continue with Google Or Facebook</h3>
            <div className="socialSignUp d-flex">
                <div className="google">
                    <button onClick={googleSignIn} className="google"><img src="/google.svg" alt="" /></button>
                </div>
                <div className="facebook">
                    <button className="facebook"><FaFacebookF></FaFacebookF></button>
                </div>
            </div>
        </div>
    )
}