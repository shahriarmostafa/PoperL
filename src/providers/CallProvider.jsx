import { Excalidraw } from "@excalidraw/excalidraw";
import { useEffect, useState, useRef } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase/firebase.init";

const WhiteboardCall = ({ channelName }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [firestoreElements, setFirestoreElements] = useState([]); // store Firestore elements here
  const whiteboardRef = useRef(null);
  const callDocRef = doc(db, "whiteboard", channelName);

  // Listen for Firestore document updates and update local state.
  useEffect(() => {
    if (!channelName) return;

    console.log("Listening for whiteboard updates on channel:", channelName);

    const unsubscribe = onSnapshot(callDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setShowWhiteboard(data.whiteboardOpen || false);
        console.log("Received Firestore update:", data);
        if (data.elements) {
          setFirestoreElements(data.elements);
        }
      } else {
        console.log("No whiteboard data found.");
      }
    });

    return () => unsubscribe();
  }, [channelName, excalidrawAPI]);

  // Whenever the Excalidraw API is ready and firestoreElements change, update the scene.
  useEffect(() => {
    if (excalidrawAPI && firestoreElements) {
      console.log("Updating Excalidraw scene with elements:", firestoreElements);
      excalidrawAPI.updateScene({
        elements: firestoreElements,
        commitToHistory: false, // avoid merging remote updates into local history
      });
    }
  }, [excalidrawAPI, firestoreElements]);

  // Handle local whiteboard changes and save to Firestore.
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

    setDoc(callDocRef, { elements: updatedElements }, { merge: true })
      .then(() => {
        console.log("Firestore update successful.");
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
                console.log("Excalidraw mounted, API:", api);
                // No extra subscription is needed here because our global listener
                // is already updating firestoreElements.
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