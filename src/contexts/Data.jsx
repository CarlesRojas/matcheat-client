import React, { createContext, useRef, useState } from "react";
import { useSpring } from "react-spring";

// Data Context
export const Data = createContext();

const DataProvider = (props) => {
    // USER
    const token = useRef(null);
    const username = useRef(null);
    const userID = useRef(null);

    // BACKGROUND POSITION
    const positionRef = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [{ speed }, setSpeed] = useSpring(() => ({ speed: { x: 0, y: 0 } }));
    const motion = useRef({ alpha: 0, beta: 0 });
    const prevMotion = useRef({ alpha: 0, beta: 0 });

    // BACKGROUND GRADIENT
    const gradients = {
        red: ["#ff8a5f", "#be4242"],
        pink: ["#ff74d4", "#ff8a5f"],
        purple: ["#8374ff", "#ff74d4"],
        blue: ["#232b62", "#78d3ff"],
    };
    const currGradient = useRef("pink");
    const [{ gradient }, setGradient] = useSpring(() => ({
        gradient: `linear-gradient(60deg, ${gradients[currGradient.current][0]} 0%, ${gradients[currGradient.current][1]} 100%)`,
        config: { friction: 30 },
    }));

    const setBackgroundGradient = (gradientName) => {
        if (!(gradientName in gradients)) return;

        // Set the background gradient
        setGradient({ gradient: `linear-gradient(60deg, ${gradients[gradientName][0]} 0%, ${gradients[gradientName][1]} 100%)` });
        currGradient.current = gradientName;
    };

    return (
        <Data.Provider
            value={{
                // USER
                token,
                username,
                userID,

                // BACKGROUND POSITION
                positionRef,
                position,
                setPosition,
                speed,
                setSpeed,
                motion,
                prevMotion,

                //BACKGROUND GRADIENT
                gradient,
                setBackgroundGradient,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
