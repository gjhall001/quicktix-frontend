import { Link } from 'react-router-dom';
import './NeedHelp.css';

function NeedHelp() {
  return (
    <>
      <div>
        <Link to="/ContactUs">
          <p>Need help?</p>
        </Link>
        <Link to="/create-new-ticket">
          <button className="newTicketBtn">Create New Ticket</button>
        </Link>
      </div>
    </>
  );
}

export default NeedHelp;