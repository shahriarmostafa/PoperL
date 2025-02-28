import { FaEdit, FaEye } from 'react-icons/fa';
import '../../styles/private/private.css';
import { MdDelete } from 'react-icons/md';
export default function Complain(){

    const doIt = (e) => {
        e.preventDefault()
    }
    return (
        <section className="complain">
            <div className="container">
                <form onSubmit={doIt} action="" className="complain-form">
                <h2>Enter your complain here</h2>
                    <input name="subject" placeholder="Enter a subject for your complain" type="text" />
                    <input name="phone" placeholder="Enter you whatsapp number for contact (optional)" type="number" />
                    <span>Submit a photo if needed (optional)</span>
                    <input type="file" />
                    <textarea rows={6} required name="complain" id=""placeholder="Describe your complain here"></textarea>
                    <input type="submit" value="Submit" />
                </form>
                <div className="view-complains">
                    <div className="complains-so-far">
                        <ul>
                            <li className='d-flex justify-content-between'>
                                <div className="info">
                                    <h5 className="subject">Duration problem</h5>
                                    <p className="paragraph">Lorem, ipsum dolor sit amet consectetur adipisicing.....</p>
                                </div>
                                <div className="actions d-flex">
                                    <button className="edit"><FaEdit></FaEdit></button>
                                    <button className="delete"><MdDelete></MdDelete></button>
                                    <button className='view'><FaEye></FaEye></button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
        
    )
}