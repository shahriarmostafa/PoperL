import Nav from '../Shared/Nav/Nav';
import People from './People';

export default function Chat(){
    return (
        <div className="chat-page">
            <section className="chat people night-view">
            <People></People>
            </section>
        </div>
    )
}