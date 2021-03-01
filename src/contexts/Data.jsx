import React, { createContext, useRef, useContext, useState } from "react";
import { useSpring } from "react-spring";

// Contexts
import { Utils } from "contexts/Utils";

// Data Context
export const Data = createContext();

const DataProvider = (props) => {
    // Contexts
    const { getCookie } = useContext(Utils);

    // LANDING CHECK
    const landingDone = useRef(false);

    // USER
    const token = useRef(null);
    const username = useRef(null);
    const userID = useRef(null);
    const image = useRef(null);

    // ROOM
    const [roomID, setRoomID] = useState(null);
    const [roomUsers, setRoomUsers] = useState([]);
    const socketError = useRef(null);
    const isBoss = useRef(false);

    // RESTAURANTS
    const restaurants = useRef([]);

    // BACKGROUND POSITION
    const positionRef = useRef({ x: 0, y: 0 });
    const speedRef = useRef({ x: 0, y: 0 });
    const motion = useRef({ alpha: 0, beta: 0 });
    const prevMotion = useRef({ alpha: 0, beta: 0 });

    // BACKGROUND GRADIENT
    const gradients = {
        red: ["#ff8a5f", "#be4242"],
        pink: ["#ff74d4", "#ff8a5f"],
        purple: ["#8374ff", "#ff74d4"],
        blue: ["#232b62", "#69acff"],
        green: ["#2d903a", "#69acff"],
        blaugrana: ["#ff5f7d", "#5542be"],
        grey: ["#808080", "#515151"],
    };
    const currGradient = useRef(getCookie("matchEat_token") ? "blaugrana" : "pink");
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
                // LANDING CHECK
                landingDone,

                // USER
                token,
                username,
                userID,
                image,

                // ROOM
                roomID,
                setRoomID,
                roomUsers,
                setRoomUsers,
                socketError,
                isBoss,

                // RESTAURANTS
                restaurants,

                // BACKGROUND POSITION
                positionRef,
                speedRef,
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
