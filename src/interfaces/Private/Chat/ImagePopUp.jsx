import { ImCross } from "react-icons/im";

const ImagePopUp = ({ imageUrl, onClose}) => {
  return (
    <div
      className="popup"    >
      <button onClick={onClose} className="close-btn"><ImCross></ImCross></button>
      <img src={imageUrl} alt="Popup" className="popup-image" />
    </div>
  );
};

export default ImagePopUp;
