import React, { createContext, useRef, useState } from "react";
import { useSpring } from "react-spring";

// Data Context
export const Data = createContext();

const DataProvider = (props) => {
    // Current user data
    const token = useRef(null);
    const username = useRef(null);
    const userID = useRef(null);

    // Current background data
    // Current position
    const positionRef = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [{ speed }, setSpeed] = useSpring(() => ({ speed: { x: 0, y: 0 } }));
    const motion = useRef({ alpha: 0, beta: 0 });
    const prevMotion = useRef({ alpha: 0, beta: 0 });

    return (
        <Data.Provider
            value={{
                // USER
                token,
                username,
                userID,

                // BACKGROUND
                positionRef,
                position,
                setPosition,
                speed,
                setSpeed,
                motion,
                prevMotion,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
