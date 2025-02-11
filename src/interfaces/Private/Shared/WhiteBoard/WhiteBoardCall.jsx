import { Excalidraw } from "@excalidraw/excalidraw";
import { useEffect, useState, useRef } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase/firebase.init";

const WhiteboardCall = ({ channelName }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const whiteboardRef = useRef(null);
  const callDocRef = doc(db, "whiteboard", channelName);

  // Firestore listener for real-time updates
  useEffect(() => {
    if (!channelName) return;

    console.log("Listening for whiteboard updates on channel:", channelName);

    const unsubscribe = onSnapshot(callDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setShowWhiteboard(data.whiteboardOpen || false);

        console.log("Received Firestore update:", data);

        // ✅ Ensure Excalidraw updates when Firestore changes
        if (excalidrawAPI && data.elements) {
          console.log("Updating Excalidraw scene...");
          excalidrawAPI.updateScene({ elements: data.elements });
        }
      } else {
        console.log("No whiteboard data found.");
      }
    });

    return () => unsubscribe();
  }, [channelName, excalidrawAPI]);

  // Handle whiteboard changes and save to Firestore
  function handleWhiteboardChange(elements) {
    if (!elements || elements.length === 0) return;
  
    const updatedElements = elements.map((element) => ({
      id: element.id || "",
      type: element.type || "",
      x: element.x !== undefined ? element.x : 0,
      y: element.y !== undefined ? element.y : 0,
      width: element.width !== undefined ? element.width : 100,
      height: element.height !== undefined ? element.height : 100,
      angle: element.angle !== undefined ? element.angle : 0,
      strokeColor: element.strokeColor || "#000000",
      backgroundColor: element.backgroundColor || "#FFFFFF",
      points: element.points
        ? element.points.map((point) => ({
            x: point.x !== undefined ? point.x : 0,
            y: point.y !== undefined ? point.y : 0,
          }))
        : [],
    }));
  
    console.log("Saving updated elements to Firestore:", updatedElements);
  
    // Push the updated elements to Firestore for syncing
    setDoc(callDocRef, { elements: updatedElements }, { merge: true })
      .then(() => {
        console.log("Firestore update successful. Propagating changes...");
      })
      .catch((error) => {
        console.error("Error saving whiteboard elements:", error);
      });
  }
  

  function closeWhiteboard() {
    setDoc(callDocRef, { whiteboardOpen: false }, { merge: true });
  }

  return (
    <>
      {showWhiteboard && (
        <div className="whiteboard-overlay">
          <div className="whiteboard-content">
            <Excalidraw
              ref={whiteboardRef}
              onMount={(api) => {
                setExcalidrawAPI(api);
                console.log("Excalidraw mounted for user:", api);
              
                // Initial scene update when Excalidraw mounts
                onSnapshot(callDocRef, (docSnapshot) => {
                  if (docSnapshot.exists()) {
                    const elements = docSnapshot.data().elements || [];
                    console.log("Initial elements from Firestore:", elements);
                    api.updateScene({ elements });
                  }
                });
              }}
              
              onChange={(elements) => handleWhiteboardChange(elements)}
            />
            <button className="close-btn" onClick={closeWhiteboard}>
              End Call
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhiteboardCall;