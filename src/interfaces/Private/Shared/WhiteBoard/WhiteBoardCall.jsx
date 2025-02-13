import React, { useEffect, useRef, useContext } from "react";
import { CallContext } from "../../../../providers/CallProvider";
import { AuthContext } from "../../../../providers/AuthProvider";
import { WhiteWebSdk } from "white-web-sdk";
import axios from "axios";

export default function WhiteBoard({ UUID }) {
  const whiteboardRef = useRef(null);
  const { setShowWhiteboard } = useContext(CallContext);
  const { user } = useContext(AuthContext);
  const UID = user?.uid;

  const getWhiteboardToken = async () => {
    try {
      const response = await axios.post("http://localhost:5000/generate-whiteboard-token", {
        UUID,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching whiteboard token:", error);
      return null;
    }
  };

  // Hardcoded token for testing purposes

  useEffect(() => {


    const initializeWhiteboard = async () => {


      try {
        

        const whiteWebSdk = new WhiteWebSdk({
          appIdentifier: "QqeacOk6Ee-n__HYKx8QBQ/LID2Et90lDgzlg", // Replace with your Agora App Identifier
          region: "us-sv", // Choose your region
        });

        
        const fullResponse = await getWhiteboardToken();
        const token = fullResponse.token;
        
        
        var joinRoomParams = {
          uuid: UUID,
          uid: UID,
          roomToken: token
        };

        console.log(joinRoomParams);
        
        
        // Joining the room with the hardcoded token
        const room = await whiteWebSdk.joinRoom(joinRoomParams);

        room.bindHtmlElement(whiteboardRef.current); // Bind the whiteboard to the ref element
      } catch (error) {
        console.error("Error initializing whiteboard:", error);
      }
    };

    initializeWhiteboard();

    return () => {
      if (whiteboardRef.current) {
        whiteboardRef.current.innerHTML = ""; // Cleanup the whiteboard if component unmounts
      }
    };
  }, [UUID, user, UID]); // Ensure dependencies are correctly set

  const closeWhiteboard = () => {
    setShowWhiteboard(false);
  };

  return (
    <div id="whiteboard-container">
      <div ref={whiteboardRef} className="whiteboard-area"></div>
      <button onClick={closeWhiteboard} className="close-whiteboard">
        Close Whiteboard
      </button>
    </div>
  );
}
