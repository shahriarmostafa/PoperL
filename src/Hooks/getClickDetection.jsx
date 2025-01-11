import { useEffect } from "react";

const getClickDetection = ({handleClick}) => {
    useEffect(() => {
        // Attach the click event listener to the entire document
        document.addEventListener("click", handleClick);        
        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [handleClick]);

    return null; // This component doesn't render anything
};

export default getClickDetection;