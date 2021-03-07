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
    const settings = useRef({ vibrate: true });

    // ROOM
    const [roomID, setRoomID] = useState(null);
    const [roomUsers, setRoomUsers] = useState([]);
    const socketError = useRef(null);
    const isBoss = useRef(false);

    // RESTAURANTS
    const restaurants = useRef([]);
    const timeStart = useRef(null);
    const mostAdvancedRoute = useRef("home");

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
        lime: ["#2d903a", "#69acff"],
        blaugrana: ["#ff5f7d", "#5542be"],
        grey: ["#5b5b5b", "#2e2e2e"],
        white: ["#979797", "#727272"],
        neutral: ["#484848", "#747474"],
        green: ["#335e23", "#a4c73a"],
    };
    const currGradient = useRef(getCookie("matchEat_token") ? "blaugrana" : "pink");
    const [{ gradient }, setGradient] = useSpring(() => ({
        gradient: `linear-gradient(60deg, ${gradients[currGradient.current][0]} 0%, ${gradients[currGradient.current][1]} 100%)`,
        config: { friction: 30 },
    }));

    // Set te background gradient by one of its presets
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
                settings,

                // ROOM
                roomID,
                setRoomID,
                roomUsers,
                setRoomUsers,
                socketError,
                isBoss,

                // RESTAURANTS
                restaurants,
                timeStart,
                mostAdvancedRoute,

                // BACKGROUND POSITION
                positionRef,
                speedRef,
                motion,
                prevMotion,

                //BACKGROUND GRADIENT
                gradient,
                currGradient,
                setGradient,
                setBackgroundGradient,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
