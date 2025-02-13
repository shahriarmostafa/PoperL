import React, { useEffect, useRef, useContext, useState } from "react";
import { CallContext } from "../../../../providers/CallProvider";
import { AuthContext } from "../../../../providers/AuthProvider";
import { WhiteWebSdk } from "white-web-sdk";
import axios from "axios";

export default function WhiteBoard({ UUID }) {
  const whiteboardRef = useRef(null);
  const { setShowWhiteboard } = useContext(CallContext);
  const { user } = useContext(AuthContext);
  const UID = user?.uid;
  const [room, setRoom] = useState(null);
  const [activeTool, setActiveTool] = useState("");

  const toolNames = [
    "pencil",
    "selector",
    "rectangle",
    "eraser",
    "text",
    "arrow",
    "ellipse",
    "hand",
    "laserPointer",
    "shape",
    "straight",
  ];

  const getWhiteboardToken = async () => {
    try {
      const response = await axios.post("http://backend-eta-blue-92.vercel.app/generate-whiteboard-token", {
        UUID,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching whiteboard token:", error);
      return null;
    }
  };

  const handleToolClick = (toolName) => {
    if (room) {
      setActiveTool(toolName);
      room.setMemberState({
        currentApplianceName: toolName,
        strokeColor: [0, 0, 0],
        strokeWidth: 5,
        textSize: 10,
      });
    }
  };

  useEffect(() => {
    const initializeWhiteboard = async () => {
      try {
        const whiteWebSdk = new WhiteWebSdk({
          appIdentifier: "QqeacOk6Ee-n__HYKx8QBQ/LID2Et90lDgzlg",
          region: "us-sv",
        });

        const fullResponse = await getWhiteboardToken();
        const token = fullResponse.token;

        const joinRoomParams = {
          uuid: UUID,
          uid: UID,
          roomToken: token,
        };

        const newRoom = await whiteWebSdk.joinRoom(joinRoomParams);

        
        


        newRoom.bindHtmlElement(whiteboardRef.current);
        newRoom.setMemberState({
          currentApplianceName: null,
          strokeWidth: 0,
        });
        setRoom(newRoom);
        
      } catch (error) {
        console.error("Error initializing whiteboard:", error);
      }
    };

    initializeWhiteboard();

    return () => {
      if (room) {
        room.disconnect();
      }
      if (whiteboardRef.current) {
        whiteboardRef.current.innerHTML = "";
      }
    };
  }, [UUID, UID]);

  const clearCurrentScene = () => {
    if (room) {
      room.cleanCurrentScene();
      room.setMemberState({
        currentApplianceName: "pencil",
        strokeColor: [0, 0, 0],
        strokeWidth: 5,
        textSize: 10,
      });
      setActiveTool("pencil")
    }
  };

  const closeWhiteboard = () => {
    if (room) {
      room.disconnect();
    }
    setShowWhiteboard(false);
  };

  return (
    <div id="whiteboard-container">
      {
        room? <div ref={whiteboardRef} className="whiteboard-area"></div> : "Loading whiteboard"
      }
      <div
        id="toolbar"
        style={{ position: "fixed", bottom: "10px", minHeight: "50px", zIndex: 10, width: "100%" }}
      >
        {toolNames.map((toolName) => (
          <button
            key={toolName}
            id={`btn${toolName}`}
            onClick={() => handleToolClick(toolName)}
            style={{ backgroundColor: activeTool === toolName ? "#000" : "#fff", color: activeTool === toolName ? "#fff" : "#000" }}
          >
            {toolName}
          </button>
        ))}
        <button onClick={clearCurrentScene}>Clear Everything</button>
      </div>
      <button onClick={closeWhiteboard} className="close-whiteboard">
        Close Whiteboard
      </button>
    </div>
  );
}
